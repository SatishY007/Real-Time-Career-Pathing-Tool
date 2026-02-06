const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../Model/User');

async function ensureDbConnected(res) {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const state = mongoose.connection?.readyState;
  if (state === 1) return true;

  // If we're in the middle of connecting, wait briefly to avoid false negatives
  if (state === 2 && typeof mongoose.connection?.asPromise === 'function') {
    try {
      await Promise.race([
        mongoose.connection.asPromise(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500)),
      ]);
    } catch {
      // ignore timeout; we'll re-check readyState below
    }
    if (mongoose.connection?.readyState === 1) return true;
    return res.status(503).json({
      msg: 'Database is still connecting. Please try again in a few seconds.'
    });
  }

  return res.status(503).json({
    msg: 'Database not connected. Check your MongoDB Atlas IP whitelist / network access and MONGO_URI, then restart the server.'
  });
}

exports.signup = async (req, res) => {
  try {
    if (!(await ensureDbConnected(res))) return;
    console.log('--- Signup endpoint hit ---');
    console.log('Signup request body:', req.body);
    const { name, email, password, skills } = req.body;
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name, email, password });
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    let user = await User.findOne({ email });
    console.log('User lookup result:', user);
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ name, email, password, skills });
    console.log('New user instance created:', user);
    await user.save();
    console.log('User saved to DB:', user.email);
    console.log('User password hash after save:', user.password);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('JWT token generated:', token ? 'yes' : 'no');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, skills: user.skills } });
    console.log('Signup response sent');
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    if (!(await ensureDbConnected(res))) return;
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: user not found for', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    console.log('User found for login:', user.email, 'Stored hash:', user.password);
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, skills: user.skills } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
