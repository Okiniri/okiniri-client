

const API_ENDPOINT = ' https://us-central1-social-api-a6ac2.cloudfunctions.net/api';

export interface GraphQlRequest {
  query: string;
  variables?: any;
}

export class Okiniri {

  constructor(
    protected appId: string,
    protected userId: string,
    protected userSecret: string,
  ) {}

  protected async sendRequest(request: GraphQlRequest) {

    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Okiniri-App-Id': this.appId,
      'X-Okiniri-Secret': `${this.userId}:${this.userSecret}`,
    });

    const options: RequestInit = {
      method: 'POST',
      headers,
      mode: 'cors',
      body: JSON.stringify(request),
    }

    const result = await fetch(API_ENDPOINT, options);
    return result
  }

  async createObject(tag: string, userId: string, objectId?: string, data?: string) {
    
    const request = {
      query:
`mutation CreateObject($tag: String!, $ownerId: ID!, $id: ID, $data: String) {
  createObject(tag: $tag, ownerId: $ownerId, id: $id, data: $data) {
    id tag ownerId timestamp data
  }
}`,
      variables: {
        tag,
        ownerId: userId,
        id: objectId,
        data,
      }
    };

    return this.sendRequest(request);
  }

  async createLink(fromId: string, tag: string, toId: string) {

    const request = {
      query:
`mutation CreateLink($fromId: ID!, $tag: String!, $toId: ID!) {
  createLink(fromId: $fromId, tag: $tag, toId: $toId) {
    tag target timestamp
  }
}`,
      variables: {
        fromId,
        tag,
        toId,
      }
    };

    return this.sendRequest(request);
  }

}