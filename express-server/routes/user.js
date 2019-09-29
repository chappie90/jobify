const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const multer = require('multer');
const nodemailer = require('nodemailer');

const User = require('../models/user');
const Application = require('../models/application');

const router = express.Router();

const MIME_TYPE_MAP = {
  'application/pdf': 'pdf'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'cv');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

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
        const token = jwt.sign(
          { email: response.email, userId: response._id },
          '$2a$10$6W2pTUnnytF1pnTBdgQm9e',
          { expiresIn: '1h' }
        );
          res.status(201).json({
            token: token,
            expiresIn: 3600,
            userId: response._id,
            userEmail: response.email,
            likedJobs: [],
            appliedJobs: []
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
        userId: fetchedUser._id,
        userEmail: fetchedUser.email,
        likedJobs: fetchedUser.likedJobs,
        appliedJobs: fetchedUser.appliedJobs
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
              token: req.body.token,
              expiresIn: 3600,
              userId: user._id,
              userEmail: user.email,
              likedJobs: [],
              appliedJobs: []
            })
          });
        } else if (user) {
          return res.status(200).json({
            token: req.body.token,
            expiresIn: 3600,
            userId: user._id,
            userEmail: user.email,
            likedJobs: user.likedJobs,
            appliedJobs: user.appliedJobs
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

router.patch('/like', (req, res, next) =>{
  const jobId = req.body.jobId;
  const userId = req.body.userId;
  const likedJobs = req.body.likedJobs;
  const jobStatus = req.body.jobStatus;
  User.findByIdAndUpdate({ _id: userId }, {likedJobs: likedJobs}, {new: true})
    .then(user => {
      if (user) {
        return res.status(200).json({
          user: user,
          jobId: jobId,
          jobStatus: jobStatus
        });
      } else {
        return res.status(401).json({
          message: 'User not found'
        });
      }   
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({
        message: 'Could not update liked jobs'
      });
    });
});

router.post(
  '/apply',
  multer({storage: storage}).single('cv'), (req, res, next) => {
    const userName = req.body.name;
    const userId = req.body.userId;
    const appliedJobs = req.body.appliedJobs;
    const jobTitle = req.body.jobTitle;
    const company = req.body.company;
    const location = req.body.location;
    console.log(location);
    const salary = req.body.salary;
    const url = req.protocol + '://' + req.get('host');
    const application = new Application({
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
      cvPath: url + '/cvs' + req.file.filename,
      userId: req.body.userId,
      jobId: req.body.jobId
    });
    application.save().then(application => {
      User.findByIdAndUpdate({ _id: userId }, { appliedJobs: appliedJobs }, {new: true})
        .then(user => {
          if (user) {
            // Send application successful email
            var transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                user: 'stoyan.garov90@gmail.com',
                pass: 'daspak12'
              }
            });
            var mailOptions = {
              from: 'Jobify<stoyan.garov90@gmail.com>',
              to: 'stoyan.garov@yahoo.com',
              subject: 'Job Application Successful',
              html: `<div style="background-color: #dcdcdc;">
                      <div style="max-width: 70%; margin: auto; background-color: #fff;">
                        <div style="background-color: #383838; padding: 4px 40px; margin: 0; border-bottom: 8px solid #9f121a; color: #fff">
                          <p style="font-size: 28px; font-weight: bold">
                            Jobify
                          </p>
                        </div>
                        <div style="padding: 10px 40px;">
                          <h3 style="font-size: 20px; color: #383838;">Hi ${userName},</h3>
                          <div>
                            <p style="background-color: #aae3c6; font-size: 16px; border: 2px solid #297e52; padding: 4px 10px">
                              <span style="display: inline-block; font-size: 20px; margin-right: 5px; background-color: #297e52; border-radius: 50%; color: #fff; padding: 1px 5px;">
                                &#x2714;
                              </span>
                              Congratulations! You have successfully applied to this job!
                            </p>
                          </div>
                          <h3 style="font-size: 22px; text-align:center; color: #383838; margin-top: 30px; margin-bottom: 8px">${jobTitle}</h3>
                          <h4 style="font-size: 17px; margin: 0; font-weight: lighter; text-align:center; color: #383838;">${company} - ${location}</h4>
                          <h4 style="font-size: 17px; margin: 0; font-weight: lighter; text-align:center; color: #383838; margin-bottom: 20px">£${salary}/annum</h4>
                          <button style="background-color: #cd1722; display: block; max-width: 120px; color: #fff; border: none; outline: 0; border-radius: 4px; margin: auto; margin-bottom: 20px; width: 100%; font-size: 16px; padding: 6px 10px; cursor: pointer;">View job</button>
                        </div>
                      </div>
                    </div>`
            };
            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent' + info.response); 
              }
            });
            return res.status(200).json({
              message: 'You have applied successfully to this job!'
            });
          } else {
            return res.status(401).json({
              message: 'User not found'
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({
        message: 'Something went wrong with your application'
      });
    });
});

module.exports = router;