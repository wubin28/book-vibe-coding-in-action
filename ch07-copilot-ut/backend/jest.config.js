// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.mts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(ts|mts)x?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'mts', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '**/__tests__/**/*.ts?(x)', 
    '**/__tests__/**/*.mts',
    '**/?(*.)+(spec|test).ts?(x)',
    '**/?(*.)+(spec|test).mts'
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,mts}',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
};