
import {
  jest,
  describe,
  expect,
  test,
} from '@jest/globals';

import { createToken } from './token';


describe('Test the createToken function', () => {

  test('Should create the same token as expected', () => {
    const token = createToken('graph_0', 'graph_0_secret');

    expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJncmFwaElkIjoiZ3JhcGhfMCJ9.eWSTkTzFg9djvnlwQI1r_2fOqYEMwJCoeaDlIaDcbGQ');
  });

  test('Should log a warning in browser env', () => {

    const oldWarn = global.console.warn;
    const oldProcess = global.process;

    global.console.warn = jest.fn();
    (global.window as any) = { exists: true };
    global.process = undefined;

    const token = createToken('graph_0', 'graph_0_secret');

    expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJncmFwaElkIjoiZ3JhcGhfMCJ9.eWSTkTzFg9djvnlwQI1r_2fOqYEMwJCoeaDlIaDcbGQ');
    expect((global.console.warn as ReturnType<typeof jest.fn>)).toHaveBeenCalledTimes(1);
    expect((global.console.warn as ReturnType<typeof jest.fn>).mock.calls[0][0])
      .toBe('The \'createToken()\' function should be used in the backend! Exposing your \'secret\' to client is not secure!');

    global.console.warn = oldWarn;
    global.process = oldProcess;
  });
});
