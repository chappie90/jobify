const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

const checkAuth = require('../middleware/check-auth');
const Employer = require('../models/employer');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const signupNotification = 'Welcome! You have successfully signed up for Jobify!';
      const employer = new Employer({ 
        email: req.body.email,
        password: hash,
        type: req.body.type,
        postedJobs: []
      });
      employer.save()
        .then(newEmployer => {
          let token = jwt.sign(
            { email: newEmployer.email, employerId: newEmployer._id },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
          );
          res.status(200).json({
            token: token,
            expiresIn: 3600,
            employerId: newEmployer._id,
            employerEmail: newEmployer.email,
            userType: newEmployer.type,
            postedJobs: []
          });
        }).catch(err => {
          console.log(err);
          res.status(401).json({
            message: 'Could not create new employer account!'
          });
        });
    })
});

module.exports = router;