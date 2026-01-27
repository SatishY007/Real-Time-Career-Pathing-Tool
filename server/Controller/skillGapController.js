const axios = require('axios');
const SkillGap = require('../Model/SkillGap');
const User = require('../Model/User');

// Dummy function for extracting skills from job descriptions
function extractSkillsFromJobs(jobs) {
  // In production, use NLP or a skills DB
  return [...new Set(jobs.flatMap(job => job.skills || []))];
}

exports.analyzeSkillGap = async (req, res) => {
  try {
    const { targetRole } = req.body;
    const user = await User.findById(req.user.id);
    // Fetch jobs for the target role (replace with real API)
    const { data: jobs } = await axios.get(`https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=YOUR_APP_ID&app_key=YOUR_APP_KEY&what=${encodeURIComponent(targetRole)}`);
    const topJobSkills = extractSkillsFromJobs(jobs.results || []);
    const missingSkills = topJobSkills.filter(skill => !user.skills.includes(skill));
    const skillGap = new SkillGap({ userId: user._id, targetRole, missingSkills });
    await skillGap.save();
    res.json({ targetRole, missingSkills });
  } catch (err) {
    res.status(500).json({ msg: 'Skill gap analysis failed', error: err.message });
  }
};
