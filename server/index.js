const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routers
app.use('/api/auth', require('./Router/auth'));
app.use('/api/skill-gap', require('./Router/skillGap'));
app.use('/api/salary', require('./Router/salary'));
app.use('/api/jobs', require('./Router/job'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
