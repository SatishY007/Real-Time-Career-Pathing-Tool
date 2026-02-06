const axios = require('axios');

function extractTerms(query) {
  const raw = String(query || '').trim();
  if (!raw) return [];
  const parts = raw
    .split(/[\s,]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set(parts)];
}

async function searchJobs({ app_id, app_key, what }) {
  const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${encodeURIComponent(app_id)}&app_key=${encodeURIComponent(app_key)}&what=${encodeURIComponent(what)}&results_per_page=20`;
  const { data } = await axios.get(url, { timeout: 15000, headers: { Accept: 'application/json' } });
  return data?.results || [];
}

async function searchRemotive({ what }) {
  const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(what)}&limit=20`;
  const { data } = await axios.get(url, {
    timeout: 15000,
    headers: { Accept: 'application/json' },
  });
  const jobs = data?.jobs || [];
  return jobs.map((j) => ({
    id: j?.id,
    title: j?.title,
    redirect_url: j?.url,
    company: { display_name: j?.company_name || 'Unknown' },
    location: { display_name: j?.candidate_required_location || 'Remote' },
  })).filter((j) => j.id && j.title && j.redirect_url);
}

function dedupeById(items) {
  const seen = new Set();
  const out = [];
  for (const item of items || []) {
    const id = item?.id;
    if (!id) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(item);
  }
  return out;
}

exports.getLiveJobs = async (req, res) => {
  try {
    const { role } = req.query;
    if (!role) return res.status(400).json({ msg: 'role is required' });
    // Replace with your Adzuna credentials
    const app_id = (process.env.ADZUNA_APP_ID || '').trim();
    const app_key = (process.env.ADZUNA_APP_KEY || '').trim();
    if (!app_id || !app_key) {
      // Fallback provider that does not require API keys.
      // Keeps the UI functional in dev/demo environments.
      const fallback = await searchRemotive({ what: role });
      return res.json(fallback.slice(0, 20));
    }

    const terms = extractTerms(role);

    // Always try the combined query first.
    const combined = await searchJobs({ app_id, app_key, what: role });
    let aggregated = combined;

    // If the user entered multiple technologies, also fetch per-term and merge.
    if (terms.length > 1) {
      const perTerm = [];
      for (const term of terms.slice(0, 6)) {
        const r = await searchJobs({ app_id, app_key, what: term });
        perTerm.push(...r);
      }
      aggregated = dedupeById([...combined, ...perTerm]);
    }

    // Keep payload size reasonable.
    res.json(aggregated.slice(0, 20));
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch jobs', error: err.message });
  }
};
