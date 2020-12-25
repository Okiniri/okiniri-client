
import {
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { mocked } from 'ts-jest/utils';
import { fetch, Response } from 'cross-fetch';

import { createToken } from './token';
import { OkiniriClient } from './client';


let token: string;
let client: OkiniriClient;


jest.mock('cross-fetch');
const fetchMock = mocked(fetch);


describe('Test client class', () => {
  test('Test default url', () => {
    const cli = new OkiniriClient(token);
    expect((cli as any).url).toBe('https://europe-west1-okiniri-core.cloudfunctions.net/api_v0 ');
  });

  test('Test provided url', () => {
    const cli = new OkiniriClient(token, { apiUrl: 'http://localhost:3000' });
    expect(cli.options.apiUrl).toBe('http://localhost:3000');
    expect((cli as any).url).toBe('http://localhost:3000');
  });

  test('Test provided url ends with /', () => {
    const cli = new OkiniriClient(token, { apiUrl: 'http://localhost:3000/' });
    expect(cli.options.apiUrl).toBe('http://localhost:3000');
    expect((cli as any).url).toBe('http://localhost:3000');
  });

  test('Test provided malformed url', () => {
    const run = () => new OkiniriClient(token, { apiUrl: 'failure' });
    expect(run).toThrow();
  });
});

describe('Test client functions', () => {


  describe('Test sendRequest()', () => {

    beforeEach(() => {
      token = createToken('graph_0', 'graph_0_secret');
      client = new OkiniriClient(token, { apiUrl: 'http://localhost:3000' });
      fetchMock.mockReset();
    });

    test('should succeed (GET)', async () => {
      const res = new Response();
      res.json = async () => ({ test: 'ok' });
      fetchMock.mockResolvedValueOnce(res);

      const r = await (client as any).sendRequest('GET', '/check');
      expect(r).toEqual({ test: 'ok' });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/check');
      expect(fetchMock.mock.calls[0][1].method).toBe('GET');
      expect(fetchMock.mock.calls[0][1].headers).toEqual({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      });
    });

    test('should succeed (GET) path without /', async () => {
      const res = new Response();
      res.json = async () => ({ test: 'ok' });
      fetchMock.mockResolvedValueOnce(res);

      const r = await (client as any).sendRequest('GET', 'check');
      expect(r).toEqual({ test: 'ok' });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/check');
    });

    test('should throw with POST/DELETE without body', async () => {
      await expect((client as any).sendRequest('POST', '/objects'))
        .rejects.toThrowError('\'body\' is mandatory for POST requests!');

      await expect((client as any).sendRequest('DELETE', '/objects'))
        .rejects.toThrowError('\'body\' is mandatory for DELETE requests!');
    });
  });


  describe('Test check()', () => {

    beforeEach(() => {
      token = createToken('graph_0', 'graph_0_secret');
      client = new OkiniriClient(token, { apiUrl: 'http://localhost:3000' });
      fetchMock.mockReset();
    });

    test('should succeed', async () => {
      const res = new Response();
      res.json = async () => ({ test: 'ok' });
      fetchMock.mockResolvedValueOnce(res);

      const r = await client.check();
      expect(r).toEqual({ test: 'ok' });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/');
      expect(fetchMock.mock.calls[0][1].method).toBe('GET');
      expect(fetchMock.mock.calls[0][1].headers).toEqual({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      });
    });

    test('should throw', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Test'));
      await expect(client.check()).rejects.toThrowError('Test');
    });
  });


  describe('Test getUnits()', () => {

    beforeEach(() => {
      token = createToken('graph_0', 'graph_0_secret');
      client = new OkiniriClient(token, { apiUrl: 'http://localhost:3000' });
      fetchMock.mockReset();
    });

    test('should succeed', async () => {
      const res = new Response();
      res.json = async () => ({ test: 'ok' });
      fetchMock.mockResolvedValueOnce(res);

      const r = await client.getUnits();
      expect(r).toEqual({ test: 'ok' });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/units');
      expect(fetchMock.mock.calls[0][1].method).toBe('GET');
      expect(fetchMock.mock.calls[0][1].headers).toEqual({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      });
    });

    test('should throw', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Test'));
      await expect(client.getUnits()).rejects.toThrowError('Test');
    });
  });


  describe('Test createObjects()', () => {

    beforeEach(() => {
      token = createToken('graph_0', 'graph_0_secret');
      client = new OkiniriClient(token, { apiUrl: 'http://localhost:3000' });
      fetchMock.mockReset();
    });

    test('should succeed', async () => {
      const res = new Response();
      res.json = async () => ({ test: 'ok' });
      fetchMock.mockResolvedValueOnce(res);

      const r = await client.createObjects([
        { tag: 'tag' },
        { tag: 'tag', id: 'id_0_0' },
      ]);
      expect(r).toEqual({ test: 'ok' });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/object');
      expect(fetchMock.mock.calls[0][1].method).toBe('POST');
      expect(fetchMock.mock.calls[0][1].headers).toEqual({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      });
      expect(JSON.parse(fetchMock.mock.calls[0][1].body as string)).toEqual([
        { tag: 'tag' },
        { tag: 'tag', id: 'id_0_0' },
      ]);
    });

    test('should throw', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Test'));
      await expect(client.createObjects([{ tag: 'tag' }])).rejects.toThrowError('Test');
    });
  });


  describe('Test deleteObjects()', () => {

    beforeEach(() => {
      token = createToken('graph_0', 'graph_0_secret');
      client = new OkiniriClient(token, { apiUrl: 'http://localhost:3000' });
      fetchMock.mockReset();
    });

    test('should succeed', async () => {
      const res = new Response();
      res.json = async () => ({ test: 'ok' });
      fetchMock.mockResolvedValueOnce(res);

      const r = await client.deleteObjects([
        { id: 'id_0_0' },
        { id: 'id_0_1' },
      ]);
      expect(r).toEqual({ test: 'ok' });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/object');
      expect(fetchMock.mock.calls[0][1].method).toBe('DELETE');
      expect(fetchMock.mock.calls[0][1].headers).toEqual({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      });
      expect(JSON.parse(fetchMock.mock.calls[0][1].body as string)).toEqual([
        { id: 'id_0_0' },
        { id: 'id_0_1' },
      ]);
    });

    test('should throw', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Test'));
      await expect(client.deleteObjects([{ id: 'tag' }])).rejects.toThrowError('Test');
    });
  });


  describe('Test createLinks()', () => {

    beforeEach(() => {
      token = createToken('graph_0', 'graph_0_secret');
      client = new OkiniriClient(token, { apiUrl: 'http://localhost:3000' });
      fetchMock.mockReset();
    });

    test('should succeed', async () => {
      const res = new Response();
      res.json = async () => ({ test: 'ok' });
      fetchMock.mockResolvedValueOnce(res);

      const r = await client.createLinks([
        { fromId: 'id_0', linkTag: 'link', toId: 'id_1' },
        { fromId: 'id_1', linkTag: 'reverse', toId: 'id_1' },
      ]);
      expect(r).toEqual({ test: 'ok' });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/link');
      expect(fetchMock.mock.calls[0][1].method).toBe('POST');
      expect(fetchMock.mock.calls[0][1].headers).toEqual({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      });
      expect(JSON.parse(fetchMock.mock.calls[0][1].body as string)).toEqual([
        { fromId: 'id_0', linkTag: 'link', toId: 'id_1' },
        { fromId: 'id_1', linkTag: 'reverse', toId: 'id_1' },
      ]);
    });

    test('should throw', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Test'));
      await expect(client.createLinks([{ fromId: 'id_0', linkTag: 'link', toId: 'id_1' }])).rejects.toThrowError('Test');
    });
  });


  describe('Test deleteLinks()', () => {

    beforeEach(() => {
      token = createToken('graph_0', 'graph_0_secret');
      client = new OkiniriClient(token, { apiUrl: 'http://localhost:3000' });
      fetchMock.mockReset();
    });

    test('should succeed', async () => {
      const res = new Response();
      res.json = async () => ({ test: 'ok' });
      fetchMock.mockResolvedValueOnce(res);

      const r = await client.deleteLinks([
        { fromId: 'id_0', linkTag: 'link', toId: 'id_1' },
        { fromId: 'id_1', linkTag: 'reverse', toId: 'id_1' },
      ]);
      expect(r).toEqual({ test: 'ok' });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/link');
      expect(fetchMock.mock.calls[0][1].method).toBe('DELETE');
      expect(fetchMock.mock.calls[0][1].headers).toEqual({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      });
      expect(JSON.parse(fetchMock.mock.calls[0][1].body as string)).toEqual([
        { fromId: 'id_0', linkTag: 'link', toId: 'id_1' },
        { fromId: 'id_1', linkTag: 'reverse', toId: 'id_1' },
      ]);
    });

    test('should throw', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Test'));
      await expect(client.deleteLinks([{ fromId: 'id_0', linkTag: 'link', toId: 'id_1' }])).rejects.toThrowError('Test');
    });
  });

  describe('Test query()', () => {

    beforeEach(() => {
      token = createToken('graph_0', 'graph_0_secret');
      client = new OkiniriClient(token, { apiUrl: 'http://localhost:3000' });
      fetchMock.mockReset();
    });

    test('should succeed', async () => {
      const res = new Response();
      res.json = async () => ({ test: 'ok' });
      fetchMock.mockResolvedValueOnce(res);

      const r = await client.query('(?a)');
      expect(r).toEqual({ test: 'ok' });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/query');
      expect(fetchMock.mock.calls[0][1].method).toBe('POST');
      expect(fetchMock.mock.calls[0][1].headers).toEqual({
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      });
      expect(JSON.parse(fetchMock.mock.calls[0][1].body as string)).toEqual({ yokyu: '(?a)' });
    });

    test('should throw', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Test'));
      await expect(client.query('(?a)')).rejects.toThrowError('Test');
    });
  });
});
