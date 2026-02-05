const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization') || req.header('authorization');
  const xAuthToken = req.header('x-auth-token');

  let token = null;
  if (authHeader) {
    const match = String(authHeader).match(/^Bearer\s+(.+)$/i);
    token = (match ? match[1] : authHeader);
  } else if (xAuthToken) {
    token = xAuthToken;
  }

  token = token ? String(token).trim().replace(/^"|"$/g, '') : null;
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
