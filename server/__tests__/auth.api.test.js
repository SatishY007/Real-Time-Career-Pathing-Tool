/**
 * Auth API Tests
 * --------------
 * These tests validate the `/api/auth` endpoints using Supertest.
 *
 * Notes:
 * - We mock the User model to avoid real MongoDB access.
 * - We mount ONLY the auth router on a minimal Express app so the tests do not
 *   import other routers/models (keeps tests fast and isolated).
 */

const request = require('supertest');
const express = require('express');

// Auth controller checks mongoose connection state; keep it "connected" in tests.
jest.mock('mongoose', () => ({
  connection: {
    readyState: 1,
  },
}));

// Mock User model used by authController.
// `mockFindOne` lets each test control "user exists" vs "user does not exist".
const mockFindOne = jest.fn();

// Provide a lightweight in-memory User model compatible with the real controller.
// The controller uses: `User.findOne(...)`, `new User(...)`, and `user.save()`.
jest.mock('../Model/User', () => {
  return class User {
    static findOne(...args) {
      return mockFindOne(...args);
    }

    constructor(data) {
      this._id = 'new-user-id';
      this.name = data?.name;
      this.email = data?.email;
      this.password = data?.password;
      this.skills = data?.skills || [];
    }

    async save() {
      // Simulate successful DB write.
      return this;
    }

    async comparePassword() {
      // Default match; tests can override by returning a custom object from findOne.
      return true;
    }
  };
});

// Create a minimal Express app for auth-only tests.
// This prevents unrelated routes (skill-gap models, etc.) from being imported.
const app = express();
app.use(express.json());
app.use('/api/auth', require('../Router/auth'));

describe('Auth API', () => {
  beforeEach(() => {
    // Ensure mocks and env vars are clean for each test.
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('POST /api/auth/signup', () => {
    it('returns 400 for missing required fields', async () => {
      // Missing name/password should produce a 400 Bad Request.
      const res = await request(app).post('/api/auth/signup').send({ email: 'a@b.com' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('msg');
    });

    it('returns 400 if user already exists', async () => {
      // When User.findOne returns an object, controller should block signup.
      mockFindOne.mockResolvedValueOnce({
        _id: 'user-id-1',
        name: 'Test User',
        email: 'test@example.com',
      });
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'A', email: 'test@example.com', password: 'password123', skills: [] });

      expect(res.status).toBe(400);
      expect(res.body.msg).toMatch(/already exists/i);
    });

    it('creates a new user and returns token', async () => {
      // When User.findOne returns null, controller should create user and return JWT.
      mockFindOne.mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'A', email: 'new@example.com', password: 'password123', skills: [] });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toMatchObject({
        name: 'A',
        email: 'new@example.com',
      });
    });
  });

  describe('POST /api/auth/login', () => {
    it('returns 400 for invalid credentials when user not found', async () => {
      // User doesn't exist => invalid credentials.
      mockFindOne.mockResolvedValueOnce(null);
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'missing@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.msg).toMatch(/invalid credentials/i);
    });

    it('returns 400 when password does not match', async () => {
      // User exists but password check fails.
      mockFindOne.mockResolvedValueOnce({
        _id: 'user-id-1',
        name: 'Test User',
        email: 'test@example.com',
        password: '$2b$10$hash',
        skills: [],
        comparePassword: jest.fn().mockResolvedValue(false),
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' });

      expect(res.status).toBe(400);
      expect(res.body.msg).toMatch(/invalid credentials/i);
    });

    it('returns token and user on successful login', async () => {
      // User exists and password matches => JWT + user profile returned.
      const doc = {
        _id: 'user-id-1',
        name: 'Test User',
        email: 'test@example.com',
        password: '$2b$10$hash',
        skills: [],
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      mockFindOne.mockResolvedValueOnce(doc);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: doc.email, password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(doc.email);
    });
  });
});
