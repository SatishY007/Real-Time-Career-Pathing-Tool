/**
 * Jobs API Tests
 * --------------
 * Tests `GET /api/jobs/live`.
 *
 * This endpoint can use either:
 * - Adzuna (when keys exist) or
 * - Remotive fallback (when keys are missing)
 *
 * We mock axios to avoid real HTTP calls.
 */

const request = require('supertest');

// Mock axios so no real HTTP requests are performed.
jest.mock('axios', () => ({
  get: jest.fn(),
}));

const axios = require('axios');
const app = require('../app');

describe('Jobs API', () => {
  beforeEach(() => {
    // Reset axios mock between tests.
    jest.clearAllMocks();
  });

  it('returns 400 when role is missing', async () => {
    // Query string role is required.
    const res = await request(app).get('/api/jobs/live');
    expect(res.status).toBe(400);
    expect(res.body.msg).toMatch(/role is required/i);
  });

  it('falls back to Remotive when Adzuna keys are missing', async () => {
    // Force fallback path by clearing Adzuna env vars.
    // Force fallback path.
    process.env.ADZUNA_APP_ID = '';
    process.env.ADZUNA_APP_KEY = '';

    axios.get.mockResolvedValueOnce({
      data: {
        jobs: [
          {
            id: 1,
            title: 'React Developer',
            url: 'https://remotive.com/job/1',
            company_name: 'ACME',
            candidate_required_location: 'Remote',
          },
        ],
      },
    });

    const res = await request(app).get('/api/jobs/live?role=react');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({
      id: 1,
      title: 'React Developer',
      redirect_url: 'https://remotive.com/job/1',
    });
  });

  it('uses Adzuna when keys exist (returns up to 20 items)', async () => {
    // When keys exist, controller calls Adzuna and returns its job results.
    process.env.ADZUNA_APP_ID = 'test-app-id';
    process.env.ADZUNA_APP_KEY = 'test-app-key';

    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 'adz-1',
            title: 'Backend Developer',
            redirect_url: 'https://adzuna.example/1',
            company: { display_name: 'Beta' },
            location: { display_name: 'NY' },
          },
        ],
      },
    });

    const res = await request(app).get('/api/jobs/live?role=node');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('title');
  });
});
