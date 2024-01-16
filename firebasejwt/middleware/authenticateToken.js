const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
    jwt.verify(token, 'Abcd@#$%123466', (err, user) => {
      if (err) return res.status(403).json({ error: 'Forbidden' });
  
      req.user = user;
      next();
    });
};

module.exports = authenticateToken;
