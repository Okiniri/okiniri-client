
import { fetch, Headers } from 'cross-fetch';
import { LinkInfo, PaginatedResult, Rule } from './model';
import { GraphLink, GraphObject, parseRawLink } from './object';

const API_ENDPOINT = ' https://us-central1-social-api-a6ac2.cloudfunctions.net/api';

export interface GraphQlRequest {
  query: string;
  variables?: any;
}

export interface GraphQlError {
  extensions: {
    code: string;
  },
  message: string;
}
export interface GraphQlResponse {
  data?: any;
  errors?: GraphQlError[];
}

export class Okiniri {

  constructor(
    protected appId: string,
    protected userId: string,
    protected userSecret: string,
  ) { }

  async sendRequest(request: GraphQlRequest) {

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

    const result: GraphQlResponse = await fetch(API_ENDPOINT, options).then(r => r.json());
    if (!!result.errors) {
      throw new Error(`${result.errors[0].extensions.code}: ${result.errors[0].message}`);
    }
    return result.data;
  }

  async createObject(tag: string, userId: string, objectId?: string, data?: string): Promise<GraphObject> {
    
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

    return this.sendRequest(request).then(data => {
      const object = data.createObject;
      return new GraphObject(this, object.id, object.tag, object.ownerId, object.timestamp, object.data);
    });
  }

  async createLink(fromId: string, tag: string, toId: string): Promise<GraphLink> {

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

    return this.sendRequest(request).then(data => parseRawLink(this, data.createLink));
  }
  
  async getObjectById(id: string): Promise<GraphObject> {

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

    return this.sendRequest(request).then(data => {
      const object = data.ObjectById;
      return new GraphObject(this, object.id, object.tag, object.ownerId, object.timestamp, object.data);
    });
  }

  async getLinkInfo(toId: string, linkTag: string, fromTag?: string, fromId?: string): Promise<LinkInfo> {
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

    return this.sendRequest(request).then(data => data.LinkInfo);
  }

  async getObjectTags(paginationToken?: string): Promise<PaginatedResult<string>> {

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

    return this.sendRequest(request).then(data => data.ObjectTags);
  }

  async getLinkTags(paginationToken?: string): Promise<PaginatedResult<string>> {

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

    return this.sendRequest(request).then(data => data.LinkTags);
  }

  async getRules(fromTag?: string, linkTag?: string, toTag?: string, paginationToken?: string): Promise<PaginatedResult<Rule>> {

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

    return this.sendRequest(request).then(data => data.Rules);
  }

  async getObjects(tag?: string, orderBy?: string, paginationToken?: string): Promise<PaginatedResult<GraphObject>> {

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

    return this.sendRequest(request).then(data => {
      const { size, token, result } = data.Objects;
      const objects = result.map(rawObject => {
        return new GraphObject(this, rawObject.id, rawObject.tag, rawObject.ownerId, rawObject.timestamp, rawObject.data);
      });
      return {
        size,
        token,
        result: objects,
      };
    });
  }
}