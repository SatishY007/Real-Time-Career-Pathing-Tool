// Database connection setup for MongoDB (or your preferred DB)
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Do not crash the entire server in dev; allow it to start and
    // return a clear error from routes that require the database.
    return false;
  }
  return true;
};

module.exports = connectDB;
