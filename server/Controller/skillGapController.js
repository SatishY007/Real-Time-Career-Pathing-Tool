const axios = require('axios');
const SkillGap = require('../Model/SkillGap');
const User = require('../Model/User');

/**
 * Skill Gap Controller
 * --------------------
 * Computes the difference between:
 * - A user’s current skills (from request + stored user profile)
 * - Skills commonly appearing in job postings for the target role
 *
 * Data sources:
 * - Primary: Adzuna job search API (requires ADZUNA_APP_ID + ADZUNA_APP_KEY)
 * - Fallback: local ROLE_SKILL_MAP / DEFAULT_SKILL_KEYWORDS if API fails
 *
 * Persistence:
 * - Updates the user’s stored skills (merge)
 * - Stores each skill-gap analysis in MongoDB (SkillGap collection)
 */

const DEFAULT_SKILL_KEYWORDS = [
  'javascript', 'typescript', 'react', 'node', 'node.js', 'express', 'next.js',
  'html', 'css', 'tailwind',
  'python', 'django', 'flask',
  'java', 'spring',
  'c#', '.net', 'asp.net',
  'sql', 'postgresql', 'mysql', 'mongodb',
  'aws', 'azure', 'gcp',
  'docker', 'kubernetes',
  'git', 'rest', 'graphql',
  'redis', 'microservices'
];

const ROLE_SKILL_MAP = {
  'frontend developer': ['javascript', 'react', 'html', 'css', 'git', 'rest'],
  'backend developer': ['node', 'express', 'sql', 'mongodb', 'git', 'rest'],
  'full stack developer': ['javascript', 'react', 'node', 'express', 'sql', 'git'],
  'data analyst': ['sql', 'python', 'excel'],
  'data scientist': ['python', 'sql', 'machine learning'],
  'devops engineer': ['docker', 'kubernetes', 'aws', 'linux', 'git']
};

/**
 * Normalizes skills for consistent comparisons.
 * Example: " React " -> "react"
 */
function normalizeSkill(skill) {
  return String(skill || '')
    .trim()
    .toLowerCase();
}

/**
 * Removes falsy values and duplicates while preserving order.
 */
function uniq(list) {
  return [...new Set(list.filter(Boolean))];
}

/**
 * Converts an incoming skills array into a clean unique token list.
 * Accepts comma/space separated entries (e.g. "react, node").
 */
function cleanSkillList(skills) {
  const parts = [];
  for (const item of (Array.isArray(skills) ? skills : [])) {
    const raw = String(item || '').trim();
    if (!raw) continue;
    for (const token of raw.split(/[\s,]+/g)) {
      const t = String(token || '').trim();
      if (t) parts.push(t);
    }
  }
  return uniq(parts);
}

/**
 * Extracts likely skill keywords from job posting text fields.
 * This is a heuristic matcher used to estimate "required skills" from listings.
 */
function extractSkillsFromJobs(jobs, skillKeywords) {
  const keywords = uniq((skillKeywords && skillKeywords.length ? skillKeywords : DEFAULT_SKILL_KEYWORDS).map(normalizeSkill));
  const found = new Set();

  for (const job of jobs || []) {
    const haystack = normalizeSkill([job.title, job.description, job.category?.label].filter(Boolean).join(' '));
    if (!haystack) continue;

    for (const kw of keywords) {
      if (!kw) continue;
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
      if (re.test(haystack)) found.add(kw);
    }
  }

  return [...found];
}

/**
 * POST /api/skill-gap/analyze (protected)
 * Body: { targetRole: string, skills: string[] }
 * Returns: { targetRole, inputSkills, missingSkills, source, warning? }
 */
exports.analyzeSkillGap = async (req, res) => {
  try {
    const { targetRole, skills } = req.body;
    if (!targetRole) return res.status(400).json({ msg: 'targetRole is required' });

    const app_id = (process.env.ADZUNA_APP_ID || '').trim();
    const app_key = (process.env.ADZUNA_APP_KEY || '').trim();
    if (!app_id || !app_key) {
      return res.status(500).json({ msg: 'Missing Adzuna credentials in server environment' });
    }

    // Skills typed on the dashboard (skill tags).
    const inputSkills = cleanSkillList(skills);

    // Merge stored skills (from DB) with newly entered skills.
    const user = await User.findById(req.user.id);
    const mergedStoredSkills = cleanSkillList([
      ...(Array.isArray(user?.skills) ? user.skills : []),
      ...inputSkills
    ]);

    if (user?._id) {
      user.skills = mergedStoredSkills;
      await user.save();
    }

    // Final normalized list for comparison.
    const userSkills = uniq([
      ...inputSkills,
      ...mergedStoredSkills
    ].map(normalizeSkill));

    // Try to fetch real job listings for the target role.
    let adzunaResults = [];
    let adzunaWarning = null;
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${encodeURIComponent(app_id)}&app_key=${encodeURIComponent(app_key)}&what=${encodeURIComponent(targetRole)}`;
      const { data: jobs } = await axios.get(url, {
        headers: {
          Accept: 'application/json'
        },
        timeout: 15000
      });
      adzunaResults = jobs?.results || [];
    } catch (e) {
      // Adzuna failure should not break the UI; we fall back to local heuristics.
      const status = e?.response?.status;
      const detail = e?.response?.data?.error || e?.response?.data || e?.message;
      console.warn('[skillGapController] Adzuna search failed', status, e?.message);
      adzunaWarning = {
        msg: 'Adzuna job search failed; using fallback skill model',
        status: status ?? null,
        detail: typeof detail === 'string' ? detail : JSON.stringify(detail)
      };
      adzunaResults = [];
    }

    const roleKey = normalizeSkill(targetRole);
    const fallbackRequired = (ROLE_SKILL_MAP[roleKey] || DEFAULT_SKILL_KEYWORDS).map(normalizeSkill);

    // Combine skill extraction from job listings with our fallback role model.
    const jobExtractedSkills = extractSkillsFromJobs(adzunaResults, DEFAULT_SKILL_KEYWORDS);
    const requiredSkills = uniq([...(jobExtractedSkills || []), ...fallbackRequired].map(normalizeSkill));

    // Missing = required - user.
    const missingSkills = requiredSkills.filter((s) => !userSkills.includes(s));

    if (user?._id) {
      const skillGap = new SkillGap({ userId: user._id, targetRole, inputSkills, missingSkills });
      await skillGap.save();
    }

    res.json({
      targetRole,
      inputSkills,
      missingSkills,
      source: adzunaWarning ? 'fallback' : 'adzuna',
      warning: adzunaWarning
    });
  } catch (err) {
    // Last-resort safety net: return fallback results so the UI still works.
    const { targetRole, skills } = req.body || {};
    const roleKey = normalizeSkill(targetRole);
    const fallbackRequired = (ROLE_SKILL_MAP[roleKey] || DEFAULT_SKILL_KEYWORDS).map(normalizeSkill);
    const inputSkills = cleanSkillList(skills);
    const userSkills = uniq(inputSkills.map(normalizeSkill));
    const missingSkills = fallbackRequired.filter((s) => !userSkills.includes(s));

    res.json({
      targetRole: targetRole || '',
      inputSkills,
      missingSkills,
      source: 'fallback',
      warning: {
        msg: 'Skill gap analysis error; returned fallback results',
        detail: err?.message || String(err)
      }
    });
  }
};
