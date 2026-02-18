/**
 * Express App (Backend)
 * ---------------------
 * This file creates the Express app instance WITHOUT starting the HTTP server.
 *
 * Why: makes the app importable for unit/integration tests (Supertest) and keeps
 * server startup (`listen`) isolated to `index.js`.
 */

const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for browser-based dev (Vite frontend calls /api via proxy).
app.use(cors());

// Parse JSON request bodies.
app.use(express.json());

// Routers
app.use('/api/auth', require('./Router/auth'));
app.use('/api/skill-gap', require('./Router/skillGap'));
app.use('/api/salary', require('./Router/salary'));
app.use('/api/jobs', require('./Router/job'));

module.exports = app;
