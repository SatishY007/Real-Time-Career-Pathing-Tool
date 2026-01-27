const express = require('express');
const router = express.Router();
const { getSalaryTrends } = require('../Controller/salaryController');

router.get('/trends', getSalaryTrends);

module.exports = router;
