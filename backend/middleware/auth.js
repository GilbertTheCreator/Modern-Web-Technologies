const jwt = require('jsonwebtoken');

function Token(req, res, next) {
  const token = req.header('Authorization');

  if (!token) return res.status(401).send('Access denied');

  jwt.verify(token, 'key', (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
}

module.exports = { Token };
