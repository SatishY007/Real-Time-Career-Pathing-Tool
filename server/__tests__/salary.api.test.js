/**
 * Salary API Tests
 * ----------------
 * Tests `GET /api/salary/trends`.
 *
 * The controller calls Adzuna endpoints via axios.
 * We mock axios to keep tests fast and deterministic.
 */

const request = require('supertest');

// Mock axios so no real HTTP requests are performed.
jest.mock('axios', () => ({
  get: jest.fn(),
}));

const axios = require('axios');
const app = require('../app');

describe('Salary API', () => {
  beforeEach(() => {
    // Ensure clean mocks/env per test.
    jest.clearAllMocks();
    process.env.ADZUNA_APP_ID = 'test-app-id';
    process.env.ADZUNA_APP_KEY = 'test-app-key';
  });

  it('returns 400 when techStack is missing', async () => {
    // Query string techStack is required.
    const res = await request(app).get('/api/salary/trends');
    expect(res.status).toBe(400);
    expect(res.body.msg).toMatch(/techStack is required/i);
  });

  it('returns mean salary using history endpoint when available', async () => {
    // History endpoint returns a `mean` field.
    axios.get.mockResolvedValueOnce({ data: { mean: 120000 } });

    const res = await request(app).get('/api/salary/trends?techStack=react');

    expect(res.status).toBe(200);
    expect(res.body.mean).toBe(120000);
    expect(res.body.source).toBe('history');
  });

  it('falls back to search endpoint when history fails', async () => {
    // If history endpoint errors, controller falls back to search results.
    // history fails
    axios.get.mockRejectedValueOnce(new Error('history down'));

    // search succeeds with salary_min/max
    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          { salary_min: 100000, salary_max: 140000 },
          { salary_min: 90000, salary_max: 110000 },
        ],
        count: 2,
      },
    });

    const res = await request(app).get('/api/salary/trends?techStack=node');

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('search');
    expect(typeof res.body.mean).toBe('number');
    expect(res.body.mean).toBeGreaterThan(0);
  });
});
