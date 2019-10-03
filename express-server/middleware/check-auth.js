const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    console.log(req);
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, '$2a$10$6W2pTUnnytF1pnTBdgQm9e');
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed'
    });
  }
};