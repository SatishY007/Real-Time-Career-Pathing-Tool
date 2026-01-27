const express = require('express');
const router = express.Router();
const { getLiveJobs } = require('../Controller/jobController');

router.get('/live', getLiveJobs);

module.exports = router;
