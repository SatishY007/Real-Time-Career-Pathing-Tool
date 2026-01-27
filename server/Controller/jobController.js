const axios = require('axios');

exports.getLiveJobs = async (req, res) => {
  try {
    const { role } = req.query;
    // Replace with your Adzuna credentials
    const app_id = process.env.ADZUNA_APP_ID;
    const app_key = process.env.ADZUNA_APP_KEY;
    const { data } = await axios.get(`https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${app_id}&app_key=${app_key}&what=${encodeURIComponent(role)}`);
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch jobs', error: err.message });
  }
};
