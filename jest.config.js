module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@component/(.*)$': '<rootDir>/src/components/$1',
    '^@style/(.*)$': '<rootDir>/static/style/$1',
  },
};