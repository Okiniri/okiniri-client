
import { KJUR } from 'jsrsasign';

const { sign } = KJUR.jws.JWS;

/**
 * Create an access token (JWT) in order to use the Okiniri REST API.
 * @note This function should be **use only in the backend**,
 * since having production secret loaded in a client environment is not secure.
 * @param graphId The ID of the graph you want to interact with.
 * @param secret The secret of the graph you want to interact with.
 */
export function createToken(graphId: string, secret: string) {

  if (typeof process === 'undefined' && !!window) {
    // eslint-disable-next-line no-console
    console.warn('The \'createToken()\' function should be used in the backend! Exposing your \'secret\' to client is not secure!');
  }

  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
  const payload = JSON.stringify({ graphId });

  return sign('HS256', header, payload, { utf8: secret });
}
