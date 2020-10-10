
import { Okiniri } from './okiniri';


export class OkiniriAdmin extends Okiniri {

  constructor(
    appId: string,
    appSecret: string,
  ) {
    super(appId, 'ADMIN', appSecret);
  }

  async defineObject(tag: string) {

    const request = {
      query:
`mutation DefineObjectTag($tag: String!) {
  createObjectTag(tag: $tag)
}`,
      variables: {
        tag,
      }
    };

    return this.sendRequest(request);
  }

  async defineLink(tag: string) {

    const request = {
      query:
`mutation DefineLinkTag($tag: String!) {
  createLinkTag(tag: $tag)
}`,
      variables: {
        tag,
      }
    };

    return this.sendRequest(request);
  }

  async defineRelation(fromTag: string, fromConstraint: string, linkTag: string, toTag: string, toConstraint: string) {

    const request = {
      query:
`mutation DefineRelationTag($fromTag: String!, $fromConstraint: String!, $linkTag: String!, $toTag: String!, $toConstraint: String!) {
  createRule(fromTag: $fromTag, fromConstraint: $fromConstraint, linkTag: $linkTag, toTag: $toTag, toConstraint: $toConstraint) {
    fromTag fromConstraint linkTag toTag toConstraint count
  }
}`,
      variables: {
        fromTag,
        fromConstraint,
        linkTag,
        toTag,
        toConstraint,
      }
    };

    return this.sendRequest(request);
  }

  async upsertUser(userId?: string) {

    const request = {
      query:
`mutation UpsertUser($id: ID) {
  upsertUser(id: $id) {
    id secret timestamp
  }
}`,
      variables: {

      }
    };

    return this.sendRequest(request);
  }

  async getUserById(id: string) {

    const request = {
      query:
`query GetUserById($id: ID!) {
  UserById(id: $id) {
    id timestamp secret
  }
}`,
      variables: {
        id,
      },
    };

    return this.sendRequest(request);
  }

  async getUsers() {

    const request = {
      query:
`query GetUsers($orderBy: String, $paginationToken: ID) {
  Users(orderBy: $orderBy, paginationToken: $paginationToken) {
    size token
    result {
      id timestamp secret
    }
  }
}`,
      variables: {},
    };

    this.sendRequest(request);
  }
}