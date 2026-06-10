import { createDefaultEsmPreset } from 'ts-jest';

const tsJestPreset = createDefaultEsmPreset({
  diagnostics: {
    ignoreCodes: [151002],
  },
});

export default {
  ...tsJestPreset,
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
