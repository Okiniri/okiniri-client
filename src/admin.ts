
import { Okiniri } from './okiniri';
import { PaginatedResult, Rule, User } from './model';


export class OkiniriAdmin extends Okiniri {

  constructor(
    appId: string,
    appSecret: string,
  ) {
    super(appId, 'ADMIN', appSecret);
  }

  async defineObject(tag: string): Promise<string> {

    const request = {
      query:
`mutation DefineObjectTag($tag: String!) {
  createObjectTag(tag: $tag)
}`,
      variables: {
        tag,
      }
    };

    return this.sendRequest(request).then(data => data.createObjectTag);
  }

  async defineLink(tag: string): Promise<string> {

    const request = {
      query:
`mutation DefineLinkTag($tag: String!) {
  createLinkTag(tag: $tag)
}`,
      variables: {
        tag,
      }
    };

    return this.sendRequest(request).then(data => data.createLinkTag);
  }

  async defineRelation(fromTag: string, fromConstraint: string, linkTag: string, toTag: string, toConstraint: string): Promise<Rule> {

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

    return this.sendRequest(request).then(data => data.createRule);
  }

  async upsertUser(userId?: string): Promise<User> {

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

    return this.sendRequest(request).then(data => data.upsertUser);
  }

  async getUserById(id: string): Promise<User> {

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

    return this.sendRequest(request).then(data => data.UserById);
  }

  async getUsers(orderBy?: string, paginationToken?: string): Promise<PaginatedResult<User>> {

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
      variables: {
        orderBy,
        paginationToken,
      },
    };

    return this.sendRequest(request).then(data => data.Users);
  }
}