import { OkiniriAdmin } from './admin';
import { OkiniriClient } from './client';
import { Okiniri } from './okiniri';


export interface GraphLink {
  tag: string;
  timestamp: number;
  target: GraphObject;
}

export function parseRawLink(graph: Okiniri | OkiniriClient | OkiniriAdmin, rawLink: any): GraphLink {
  return {
    tag: rawLink.tag,
    timestamp: rawLink.timestamp,
    target: new GraphObject(
      graph,
      rawLink.target.id,
      rawLink.target.tag,
      rawLink.target.ownerId,
      rawLink.target.timestamp,
      rawLink.target.data,
    ),
  }
}


export class GraphObject {


    constructor(
      public graph: Okiniri | OkiniriClient | OkiniriAdmin,
      public id: string,
      public tag: string,
      public ownerId: string,
      public timestamp: number,
      public data?: string
    ) {}

    linkFrom(linkTag?: string, objectTag?: string, orderBy?: string, paginationToken?: string) {
      
      const request = {
        query:
`query GetObjectLinkFrom($id: ID!, $linkTag: String, $objectTag: String, $orderBy: String, $paginationToken: ID) {
  ObjectById(id: $id) {
    linkFrom(linkTag: $linkTag, objectTag: $objectTag, orderBy: $orderBy, paginationToken: $paginationToken) {
      size token
      result {
        tag timestamp
        target {
          id tag ownerId timestamp data
        }
      }
    }
  }
}`,
        variables: {
          id: this.id,
          linkTag,
          objectTag,
          orderBy,
          paginationToken,
        },
      };

      return this.graph.sendRequest(request).then(data => {
        const { size, token, result } = data.ObjectById.linkFrom;
        const links = result.map(rawLink => parseRawLink(this.graph, rawLink));
        return {
          size,
          token,
          result: links,
        };
      });
    }

    linkTo(linkTag?: string, objectTag?: string, orderBy?: string, paginationToken?: string) {
      
      const request = {
        query:
`query GetObjectLinkTo($id: ID!, $linkTag: String, $objectTag: String, $orderBy: String, $paginationToken: ID) {
  ObjectById(id: $id) {
    linkTo(linkTag: $linkTag, objectTag: $objectTag, orderBy: $orderBy, paginationToken: $paginationToken) {
      size token
      result {
        tag timestamp
        target {
          id tag ownerId timestamp data
        }
      }
    }
  }
}`,
        variables: {
          id: this.id,
          linkTag,
          objectTag,
          orderBy,
          paginationToken,
        },
      };

      return this.graph.sendRequest(request).then(data => {
        const { size, token, result } = data.ObjectById.linkFrom;
        const links = result.map(rawLink => parseRawLink(this.graph, rawLink));
        return {
          size,
          token,
          result: links,
        };
      });
    }
}
