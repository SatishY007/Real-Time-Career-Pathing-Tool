/**
 * Server Entry Point (Backend)
 * ----------------------------
 * Loads environment variables, connects to DB, and starts listening.
 *
 * Note: The Express app is created in `app.js` so it can be imported in tests
 * without opening a network port.
 */

require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');

// Connect to MongoDB (Atlas/local) using Mongoose.
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
