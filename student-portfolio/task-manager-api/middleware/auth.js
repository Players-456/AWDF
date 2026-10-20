const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Check if the Authorization header exists and follows the Bearer pattern
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication failed. Token missing or invalid format.' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication failed. Token missing.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user payload to the request object
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error.message);
    return res.status(401).json({ error: 'Authentication failed. Invalid or expired token.' });
  }
};

module.exports = auth;
