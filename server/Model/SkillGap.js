const mongoose = require('mongoose');

const SkillGapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: { type: String, required: true },
  inputSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SkillGap', SkillGapSchema);
