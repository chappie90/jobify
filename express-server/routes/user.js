const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
        type: req.body.type
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
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        '$2a$10$6W2pTUnnytF1pnTBdgQm9e',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      res.status(401).json({
        message: 'Invalid user'
      });
    })
});

router.post('/google-login', (req, res, next) => {
  const client = new OAuth2Client('512923305156-97lqdnfddn8ilnf7qemr6lj36dig8830.apps.googleusercontent.com');
  async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: '512923305156-97lqdnfddn8ilnf7qemr6lj36dig8830.apps.googleusercontent.com'
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  if (userid) {
    User.findOne({ email: req.body.email }).
      then(user => {
        if (!user) {
          const user = new User({
            email: req.body.email,
            password: req.body.token,
            type: req.body.type
          });
          user.save()
          .then(response => {
            return res.status(200).json({
              message: 'New user created'
            })
          });
        } else if (user) {
          return res.status(200).json({
            message: 'User successfully logged in',
            user: user
          })
        }
      })
      .catch(err => {
        res.status(401).json({
          message: 'Could not create user'
        })
      })
  } 

  }
  verify().catch(console.error);
});

module.exports = router;