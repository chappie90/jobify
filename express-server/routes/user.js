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

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Invalid user'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Invalid user'
        });
      }
      res.status(200).json({
        message: 'Logged in',
        data: fetchedUser
      });
    })
    .catch(err => {
      res.status(401).json({
        message: 'Invalid user'
      });
    })
});

module.exports = router;