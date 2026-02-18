/**
 * Skill Gap API Tests
 * -------------------
 * Tests the protected endpoint `POST /api/skill-gap/analyze`.
 *
 * Strategy:
 * - Use Supertest against the real Express router.
 * - Mock external dependencies (axios calls to Adzuna) and Mongo models.
 * - Use a real JWT signed with the test secret to exercise auth middleware.
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock axios so no real HTTP requests are performed.
jest.mock('axios', () => ({
  get: jest.fn(),
}));

const axios = require('axios');

// Mock models used by skillGapController.
// We avoid connecting to MongoDB by stubbing `User.findById` and SkillGap.save.
const mockUserFindById = jest.fn();
const mockUserSave = jest.fn().mockResolvedValue(true);

jest.mock('../Model/User', () => ({
  findById: (...args) => mockUserFindById(...args),
}));

const mockSkillGapSave = jest.fn().mockResolvedValue(true);

jest.mock('../Model/SkillGap', () => {
  return class SkillGap {
    constructor(data) {
      Object.assign(this, data);
    }

    async save() {
      // Track persistence without hitting DB.
      return mockSkillGapSave();
    }
  };
});

const app = require('../app');

describe('Skill Gap API', () => {
  beforeEach(() => {
    // Reset mocks and ensure required env vars exist for each test.
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    process.env.ADZUNA_APP_ID = 'test-app-id';
    process.env.ADZUNA_APP_KEY = 'test-app-key';
  });

  function makeToken(id = 'user-1') {
    // Auth middleware expects { id } inside token payload.
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  it('rejects request without token (401)', async () => {
    // Endpoint is protected by JWT auth middleware.
    const res = await request(app).post('/api/skill-gap/analyze').send({ targetRole: 'frontend developer', skills: ['react'] });
    expect(res.status).toBe(401);
  });

  it('returns 400 when targetRole is missing', async () => {
    // Controller requires targetRole to run analysis.
    const token = makeToken();
    const res = await request(app)
      .post('/api/skill-gap/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({ skills: ['react'] });

    expect(res.status).toBe(400);
    expect(res.body.msg).toMatch(/targetRole is required/i);
  });

  it('returns missingSkills based on Adzuna results and persists analysis', async () => {
    // Happy-path test: user exists, Adzuna returns some results, controller persists.
    const token = makeToken('user-xyz');

    mockUserFindById.mockResolvedValueOnce({
      _id: 'user-xyz',
      skills: ['react'],
      save: mockUserSave,
    });

    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          { title: 'Frontend Developer', description: 'React Docker Kubernetes', category: { label: 'Web' } },
        ],
      },
    });

    const res = await request(app)
      .post('/api/skill-gap/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({ targetRole: 'frontend developer', skills: ['react'] });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('missingSkills');
    expect(Array.isArray(res.body.missingSkills)).toBe(true);

    // Assert response structure + a couple of predictable properties.
    expect(res.body.missingSkills.length).toBeGreaterThan(0);
    expect(res.body.missingSkills).toEqual(expect.arrayContaining(['javascript']));
    expect(res.body.missingSkills).not.toEqual(expect.arrayContaining(['react']));

    // user skills merged + saved
    expect(mockUserSave).toHaveBeenCalled();

    // analysis persisted
    expect(mockSkillGapSave).toHaveBeenCalled();
  });

  it('falls back gracefully when Adzuna call fails (still returns 200)', async () => {
    // If Adzuna is down, controller returns fallback results instead of failing.
    const token = makeToken('user-abc');

    mockUserFindById.mockResolvedValueOnce({
      _id: 'user-abc',
      skills: [],
      save: mockUserSave,
    });

    axios.get.mockRejectedValueOnce(new Error('Adzuna down'));

    const res = await request(app)
      .post('/api/skill-gap/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({ targetRole: 'devops engineer', skills: [] });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('missingSkills');
    expect(res.body.source).toMatch(/fallback|adzuna/i);
  });
});
