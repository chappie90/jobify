const express = require('express');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  res.status(201).json({
    message: 'User created',
    response: user
  });
});

module.exports = router;