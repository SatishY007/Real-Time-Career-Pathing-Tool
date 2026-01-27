const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const { analyzeSkillGap } = require('../Controller/skillGapController');

router.post('/analyze', auth, analyzeSkillGap);

module.exports = router;
