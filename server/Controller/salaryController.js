const axios = require('axios');

exports.getSalaryTrends = async (req, res) => {
  try {
    const { techStack } = req.query;
    // Replace with your Adzuna credentials
    const app_id = process.env.ADZUNA_APP_ID;
    const app_key = process.env.ADZUNA_APP_KEY;
    const { data } = await axios.get(`https://api.adzuna.com/v1/api/jobs/us/history?app_id=${app_id}&app_key=${app_key}&what=${encodeURIComponent(techStack)}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch salary trends', error: err.message });
  }
};
