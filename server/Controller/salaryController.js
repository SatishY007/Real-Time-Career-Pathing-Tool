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

async function fetchHistoryMean({ app_id, app_key, what }) {
  const historyUrl = `https://api.adzuna.com/v1/api/jobs/us/history?app_id=${encodeURIComponent(app_id)}&app_key=${encodeURIComponent(app_key)}&what=${encodeURIComponent(what)}`;
  const resp = await axios.get(historyUrl, { timeout: 15000, headers: { Accept: 'application/json' } });
  const data = resp.data;
  const mean = (typeof data?.mean === 'number' && Number.isFinite(data.mean))
    ? data.mean
    : computeMeanFromHistogram(data?.histogram);
  return { mean: Number.isFinite(mean) ? mean : null, data };
}

async function fetchSearchMean({ app_id, app_key, what }) {
  const searchUrl = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${encodeURIComponent(app_id)}&app_key=${encodeURIComponent(app_key)}&what=${encodeURIComponent(what)}&results_per_page=50`;
  const resp = await axios.get(searchUrl, { timeout: 15000, headers: { Accept: 'application/json' } });
  const results = resp?.data?.results || [];
  const mean = computeMeanFromSearchResults(results);
  return {
    mean: Number.isFinite(mean) ? mean : null,
    data: {
      mean,
      count: resp?.data?.count,
      results_sample_size: results.length
    }
  };
}

function computeMeanFromHistogram(histogram) {
  if (!histogram || typeof histogram !== 'object') return null;
  let weightedSum = 0;
  let total = 0;
  for (const [k, v] of Object.entries(histogram)) {
    const salary = Number(k);
    const count = Number(v);
    if (!Number.isFinite(salary) || !Number.isFinite(count) || count <= 0) continue;
    weightedSum += salary * count;
    total += count;
  }
  if (total <= 0) return null;
  return Math.round(weightedSum / total);
}

function computeMeanFromSearchResults(results) {
  const salaries = [];
  for (const job of results || []) {
    const min = Number(job?.salary_min);
    const max = Number(job?.salary_max);
    if (Number.isFinite(min) && Number.isFinite(max) && min > 0 && max > 0) {
      salaries.push((min + max) / 2);
      continue;
    }
    if (Number.isFinite(min) && min > 0) {
      salaries.push(min);
      continue;
    }
    if (Number.isFinite(max) && max > 0) {
      salaries.push(max);
    }
  }
  if (!salaries.length) return null;
  const mean = salaries.reduce((a, b) => a + b, 0) / salaries.length;
  return Math.round(mean);
}

exports.getSalaryTrends = async (req, res) => {
  try {
    const { techStack } = req.query;
    if (!techStack) return res.status(400).json({ msg: 'techStack is required' });
    // Replace with your Adzuna credentials
    const app_id = (process.env.ADZUNA_APP_ID || '').trim();
    const app_key = (process.env.ADZUNA_APP_KEY || '').trim();
    if (!app_id || !app_key) {
      return res.status(500).json({ msg: 'Missing Adzuna credentials in server environment' });
    }

    let data = null;
    let mean = null;
    let source = 'history';
    let warning = null;

    try {
      const resp = await fetchHistoryMean({ app_id, app_key, what: techStack });
      data = resp.data;
      mean = resp.mean;
    } catch (e) {
      warning = {
        msg: 'Adzuna history endpoint failed; falling back to search salaries',
        status: e?.response?.status ?? null,
        detail: e?.message
      };
    }

    if (mean == null) {
      source = 'search';
      const resp = await fetchSearchMean({ app_id, app_key, what: techStack });
      mean = resp.mean;
      data = resp.data;
    }

    // If multi-term query yields no salary mean, try individual terms.
    if (mean == null) {
      const terms = extractTerms(techStack);
      if (terms.length > 1) {
        for (const term of terms.slice(0, 4)) {
          try {
            const h = await fetchHistoryMean({ app_id, app_key, what: term });
            if (h.mean != null) {
              mean = h.mean;
              data = h.data;
              source = 'history';
              warning = {
                ...(warning || {}),
                msg: 'No salary mean for combined query; used a single-term fallback',
                fallbackTerm: term
              };
              break;
            }
          } catch {
            // ignore and fall back to search
          }

          try {
            const s = await fetchSearchMean({ app_id, app_key, what: term });
            if (s.mean != null) {
              mean = s.mean;
              data = s.data;
              source = 'search';
              warning = {
                ...(warning || {}),
                msg: 'No salary mean for combined query; used a single-term fallback',
                fallbackTerm: term
              };
              break;
            }
          } catch {
            // ignore
          }
        }
      }
    }

    res.json({
      ...(data || {}),
      mean: mean ?? null,
      source,
      warning
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch salary trends', error: err.message });
  }
};
