
import { fetch } from 'cross-fetch';
import {
  validateQuery,
  validateCreateObjects,
  validateDeleteObjects,
  validateCreateOrDeleteLinks,
} from '@okiniri/validate';

const DEFAULT_API_URL = 'https://europe-west1-okiniri-dawn.cloudfunctions.net/api_v0';

export interface OkiniriClientOptions {
  apiUrl?: string;
}

function assertUrl(toCheck: string) {
  const url = new URL(toCheck);
  return !!url;
}

export class OkiniriClient {

  private url: string;

  constructor(private token: string, public options?: OkiniriClientOptions) {
    if (!!this.options?.apiUrl && this.options.apiUrl.endsWith('/')) {
      this.options.apiUrl = this.options.apiUrl.substring(0, this.options.apiUrl.length - 1);
    }
    this.url = options?.apiUrl ?? DEFAULT_API_URL;
    assertUrl(this.url);
  }

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

  public async check() {
    return this.sendRequest('GET', '/');
  }

  public async getUnits() {
    return this.sendRequest('GET', '/units');
  }

  public async createObjects(objects: { tag: string, id?: string }[]) {
    validateCreateObjects(objects);
    return this.sendRequest('POST', '/object', objects);
  }

  public async deleteObjects(objects: { id: string }[]) {
    validateDeleteObjects(objects);
    return this.sendRequest('DELETE', '/object', objects);
  }

  public async createLinks(links: { fromId: string, linkTag: string, toId: string }[]) {
    validateCreateOrDeleteLinks(links);
    return this.sendRequest('POST', '/link', links);
  }

  public async deleteLinks(links: { fromId: string, linkTag: string, toId: string }[]) {
    validateCreateOrDeleteLinks(links);
    return this.sendRequest('DELETE', '/link', links);
  }

  public async query(query: string) {
    validateQuery(query);
    return this.sendRequest('POST', '/query', { yokyu: query });
  }
}
