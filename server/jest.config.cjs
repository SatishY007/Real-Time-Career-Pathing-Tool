/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
