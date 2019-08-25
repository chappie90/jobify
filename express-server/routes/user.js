const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
      .then(response => {
          res.status(201).json({
            message: 'User created',
            response: user
          });  
      })
      .catch(err => {
        console.log(err);
      });
    });
});

module.exports = router;