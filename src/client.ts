
import { fetch } from 'cross-fetch';
import {
  validateQuery,
  validateCreateObjects,
  validateDeleteObjects,
  validateCreateOrDeleteLinks,
} from '@okiniri/validate';

const DEFAULT_API_URL = 'https://europe-west1-okiniri-core.cloudfunctions.net/api_v0 ';

/** Override default options of the client */
export interface OkiniriClientOptions {
  /** Override the default api url, this is useful for tests. */
  apiUrl?: string;
}

/** Assert that a string is a valid url, the function will throw if not */
function assertUrl(toCheck: string) {
  const url = new URL(toCheck);
  return !!url;
}

export class OkiniriClient {

  /** url where _every_ request will be sent */
  private url: string;

  /**
   * Create a new instance of a client to interact with the Okiniri REST API.
   * @param token an access token (JWT) that will be check on _every_ request
   * @param options override the default client configuration
   */
  constructor(private token: string, public options?: OkiniriClientOptions) {
    if (!!this.options?.apiUrl && this.options.apiUrl.endsWith('/')) {
      this.options.apiUrl = this.options.apiUrl.substring(0, this.options.apiUrl.length - 1);
    }
    this.url = options?.apiUrl ?? DEFAULT_API_URL;
    assertUrl(this.url);
  }

  /**
   * Main function that actually send the API request.
   * @param method HTTP method to use
   * @param path the api path to use
   * @param body the data to send (MUST be JSON.stringifiable)
   */
  private async sendRequest(method: 'POST' | 'DELETE' | 'GET', path: string, body?: any) {
    let safePath = path;
    if (!path.startsWith('/')) safePath = `/${safePath}`;

    if (method === 'POST' || method === 'DELETE') {
      if (!body) throw new Error(`'body' is mandatory for ${method} requests!`);
    }
    const init = {
      mode: 'cors' as 'cors',
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${this.token}`,
      },
    };

    (init as typeof init & { body: any }).body = JSON.stringify(body);

    return fetch(`${this.url}${safePath}`, init).then(res => res.json());
  }

  /**
   * Simple utils function to check that the client has been correctly instantiated.
   * This function should return 'OK' to every request.
   */
  public async check() {
    return this.sendRequest('GET', '/');
  }

  /**
   * Retrieve the amount of units consumed by the graph so far during the current billing period.
   */
  public async getUnits() {
    return this.sendRequest('GET', '/units');
  }

  /**
   * Create new objects and insert them into the graph.
   * Tying to insert an object that already exists will result in an error.
   * @param objects the objects to insert (min: 1, max: 100 included)
   */
  public async createObjects(objects: { tag: string, id?: string }[]) {
    validateCreateObjects(objects);
    return this.sendRequest('POST', '/object', objects);
  }

  /**
   * Delete objects from the graph.
   * Tying to delete an object which is still linked will result in an error.
   * @param objects the objects to delete (min: 1, max: 100 included)
   */
  public async deleteObjects(objects: { id: string }[]) {
    validateDeleteObjects(objects);
    return this.sendRequest('DELETE', '/object', objects);
  }

  /**
   * Create links between _existing_ objects.
   * @param links the links to create (min: 1, max 50 included)
   */
  public async createLinks(links: { fromId: string, linkTag: string, toId: string }[]) {
    validateCreateOrDeleteLinks(links);
    return this.sendRequest('POST', '/link', links);
  }

  /**
   * Delete links from the graph.
   * @param links the links to create (min: 1, max 50 included)
   */
  public async deleteLinks(links: { fromId: string, linkTag: string, toId: string }[]) {
    validateCreateOrDeleteLinks(links);
    return this.sendRequest('DELETE', '/link', links);
  }

  /**
   * Perform a query on the graph.
   * @param query a query written in the Yokyu query language
   */
  public async query(query: string) {
    validateQuery(query);
    return this.sendRequest('POST', '/query', { yokyu: query });
  }
}
