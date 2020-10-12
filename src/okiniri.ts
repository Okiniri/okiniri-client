
import { fetch, Headers } from 'cross-fetch';

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
  ) { }

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
    };

    const result = await fetch(API_ENDPOINT, options).then(r => r.json());
    return result;
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
      },
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
      },
    };

    return this.sendRequest(request);
  }
  
  async getObjectById(id: string) {

    const request = {
      query:
`query GetObjectById($id: ID!) {
  ObjectById(id: $id) {
    id tag ownerId timestamp data
  }
}`,
      variables: {
        id,
      },
    };

    return this.sendRequest(request);
  }

  async getLinkInfo(toId: string, linkTag: string, fromTag?: string, fromId?: string) {
    const request = {
      query:
`query GetLinkInfo($toId: ID!, $linkTag: String!, $fromTag: String, $fromId: ID) {
  LinkInfo(toId: $toId, linkTag: $linkTag, fromTag: $fromTag, fromId: $fromId) {
    linked count
  }
}`,
      variables: {
        toId,
        linkTag,
        fromTag,
        fromId,
      },
    };

    return this.sendRequest(request);
  }

  async getObjectTags(paginationToken?: string) {

    const request = {
      query:
`query GetObjectTags($paginationToken: ID) {
  ObjectTags(paginationToken: $paginationToken) {
    size token result
  }
}`,
      variables: {
        paginationToken,
      },
    };

    return this.sendRequest(request);
  }

  async getLinkTags(paginationToken?: string) {

    const request = {
      query:
`query GetLinkTags($paginationToken: ID) {
  LinkTags(paginationToken: $paginationToken) {
    size token result
  }
}`,
      variables: {
        paginationToken,
      },
    };

    return this.sendRequest(request);
  }

  async getRules(fromTag?: string, linkTag?: string, toTag?: string, paginationToken?: string) {

    const request = {
      query:
`query GetRules($fromTag: String, $linkTag: String, $toTag: String, $paginationToken: ID) {
  Rules(fromTag: $fromTag, linkTag: $linkTag, toTag: $toTag, paginationToken: $paginationToken) {
    size token
    result {
      fromTag fromConstraint linkTag toTag toConstraint count
    }
  }
}`,
      variables: {
        fromTag,
        linkTag,
        toTag,
        paginationToken,
      },
    };

    return this.sendRequest(request);
  }

  async getObjects(tag?: string, orderBy?: string, paginationToken?: string) {

    const request = {
      query:
`query GetObjects($tag: String, $orderBy: String, $paginationToken: ID) {
  Objects(tag: $tag, orderBy: $orderBy, paginationToken: $paginationToken) {
    size token
    result {
      id tag ownerId timestamp data
    }
  }
}`,
      variables: {
        tag,
        orderBy,
        paginationToken,
      },
    };

    return this.sendRequest(request);
  }
}