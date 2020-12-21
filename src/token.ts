
import { KJUR } from 'jsrsasign';

const { sign } = KJUR.jws.JWS;

export function createToken(graphId: string, secret: string) {

  if (typeof process === 'undefined' && !!window) {
    // eslint-disable-next-line no-console
    console.warn('The \'createToken()\' function should be used in the backend! Exposing your \'secret\' to client is not secure!');
  }

  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
  const payload = JSON.stringify({ graphId });

  return sign('HS256', header, payload, secret);
}
