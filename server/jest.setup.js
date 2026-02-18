// Jest global test setup for backend API tests.
// We set test env vars here so tests run without requiring a real .env.

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Provide placeholders so controllers that check for Adzuna credentials can run.
process.env.ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || 'test-app-id';
process.env.ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY || 'test-app-key';
