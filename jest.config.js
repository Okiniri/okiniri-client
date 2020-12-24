
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    './src/*.ts',
    '!./src/index.ts',
    '!./src/index.dev.ts',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
};
