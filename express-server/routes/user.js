const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');
const Application = require('../models/application');

const router = express.Router();

const MIME_TYPE_MAP = {
  'application/pdf': 'pdf'
};

const MIME_TYPE_MAP_AVATAR = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, './public/uploads/');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

const storageAvatar = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP_AVATAR[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, './public/uploads/');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP_AVATAR[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const signupNotification ='Welcome! You have successfully signed up for Jobify!';
      const user = new User({
        email: req.body.email,
        password: hash,
        type: req.body.type,
        notifications: [{ date: new Date(), type: 'join', notification: signupNotification, status: 0 }],
        newNotifications: 1,
        cvPath: '',
        cvName: '',
        profile: {
          summary: {
            avatarPath: ''
          }
        }
      });
      user.save()
      .then(newUser => {
        let token = jwt.sign(
          { email: newUser.email, userId: newUser._id },
          process.env.JWT_KEY,
          { expiresIn: '1h' }
        );
         res.status(201).json({
            token: token,
            expiresIn: 3600,
            userId: newUser._id,
            userEmail: newUser.email,
            userType: newUser.type,
            myJobs: {
              applied: [],
              saved: []
            },
            notifications: newUser.notifications,
            newNotifications: newUser.newNotifications,
            cv: newUser.cvPath,
            cvName: newUser.cvName,
            summary: {},
            avatarPath: newUser.profile.summary.avatarPath
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
      if (result) {
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          process.env.JWT_KEY,
          { expiresIn: '1h' }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          userEmail: fetchedUser.email,
          userType: fetchedUser.type,
          myJobs: fetchedUser.myJobs,
          notifications: fetchedUser.notifications,
          newNotifications: fetchedUser.newNotifications,
          cv: fetchedUser.cvPath,
          cvName: fetchedUser.cvName,
          summary: fetchedUser.profile.summary,
          avatarPath: fetchedUser.profile.summary.avatarPath 
        });
      } else {
        return res.status(401).json({
          message: 'Invalid user'
        });
      }
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
          const signupNotification ='Welcome! You have successfully signed up for Jobify';
          const user = new User({
            email: req.body.email,
            password: req.body.token,
            type: req.body.type,
            notifications: [{ date: new Date(), type: 'join', notification: signupNotification, status: 0 }]
          });
          user.save()
          .then(response => {
            return res.status(200).json({
              token: req.body.token,
              expiresIn: 3600,
              userId: user._id,
              userEmail: user.email,
              userType: user.type,
              myJobs: {
                applied: [],
                saved: []
              },
              // likedJobs: [],
              // appliedJobs: [],
              notifications: user.notifications,
              cv: '',
              cvName: '',
              summary: {}
            })
          });
        } else if (user) {
          return res.status(200).json({
            token: req.body.token,
            expiresIn: 3600,
            userId: user._id,
            userEmail: user.email,
            userType: user.type,
            myJobs: user.myJobs,
            // likedJobs: user.likedJobs,
            // appliedJobs: user.appliedJobs,
            notifications: user.notifications,
            cv: user.cvPath,
            cvName: user.cvName,
            summary: user.profile.summary
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

router.patch('/like', checkAuth, (req, res, next) =>{
  const jobId = req.body.jobId;
  const userId = req.body.userId;
  const likedJobs = req.body.likedJobs;
  const jobStatus = req.body.jobStatus;
  User.findByIdAndUpdate(
    { _id: userId }, 
    { myJobs: { 
        saved: likedJobs
      }
    },
    {new: true}
  ).then(user => {
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
  '/cv/upload',
 // checkAuth,
  multer({storage: storage}).single('cv'), (req, res, next) => {
    const userId = req.body.userId;
     const url = req.protocol + '://' + req.get('host');
    User.findByIdAndUpdate(
      { _id: userId },
      { cvPath: url + '/ftp/uploads/' + req.file.filename, 
        cvName: req.file.originalname },
      { new: true }
    ).then(user => {
      if (user) {
        return res.status(200).json({
          cv: user.cvPath,
          cvName: user.cvName
        });
      }
    }).catch(err => {
      console.log(err);
      res.status(401).json({
        message: 'Could not upload CV'
      });
    }) 
});

router.patch(
  '/cv/delete',
  // checkAuth,
  (req, res, next) => {
    const userId = req.body.userId;
    User.findByIdAndUpdate(
      { _id: userId },
      { cvPath: '', cvName: '' },
      { new: true }
    ).then(user => {
      if (user) {
        return res.status(200).json({
          cv: user.cvPath,
          cvName: user.cvName
        });
      }
    }).catch(err => {
      console.log(err);
      res.status(401).json({
        message: 'Could not delete CV'
      });
    });
});

router.post(
  '/apply',
//  checkAuth,
  multer({storage: storage}).single('cv'), (req, res, next) => {
    const userName = req.body.name;
    const userId = req.body.userId;
    const appliedJobs = JSON.parse(req.body.appliedJobs);
    const jobTitle = req.body.jobTitle;
    const company = req.body.company;
    const location = req.body.location;
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
      const appliedNotification = `Congratulations! You have successfully applied for the role of ${jobTitle}!`;
      User.findByIdAndUpdate(
          { _id: userId }, 
          { myJobs: { applied: appliedJobs},
            $inc: { newNotifications: 1 },
            $push: { notifications: { 
                                      date: new Date(), 
                                      type: 'apply', 
                                      notification: appliedNotification, 
                                      status: 0 
                                    }
                    }
          }, {new: true}
        ).then(user => {
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
                      <div style="max-width: 600px; margin: auto; background-color: #fff;">
                        <div style="background-color: #383838; border-bottom: 8px solid #9f121a">
                          <div style="max-width: 560px; margin: auto; background-color: #383838;">
                            <div style="background-color: #383838; padding: 4px 10px; margin: 0 auto; color: #fff">
                              <p style="font-size: 28px; font-weight: bold">
                                Jobify
                              </p>
                            </div>
                          </div>
                        </div>
                        <div style="max-width: 560px; margin: auto;">
                          <div style="padding: 20px 10px;">
                            <h3 style="font-size: 20px; color: #383838; ">Hi ${userName},</h3>
                            <div style="background-color: #aae3c6; padding: 0 10px; border: 2px solid #297e52;">
                              <span style="display: inline-block; font-size: 20px; margin-right: 8px; background-color: #297e52; border-radius: 50%; color: #fff; padding: 1px 5px;">
                                &#x2714;
                              </span>
                              <p style="display: inline-block; font-size: 16px;">               
                                Congratulations! You have successfully applied to this job!
                              </p>
                            </div>
                            <h3 style="font-size: 22px; text-align:center; color: #383838; margin-top: 30px; margin-bottom: 8px">${jobTitle}</h3>
                            <h4 style="font-size: 17px; margin: 0; font-weight: lighter; text-align:center; color: #383838;">${company} - ${location}</h4>
                            <h4 style="font-size: 17px; margin: 0; font-weight: lighter; text-align:center; color: #383838; margin-bottom: 20px">£${salary}/annum</h4>
                            <button style="background-color: #cd1722; display: block; max-width: 120px; color: #fff; border: none; outline: 0; border-radius: 4px; margin: auto; margin-bottom: 20px; width: 100%; font-size: 16px; padding: 6px 10px; cursor: pointer;">View job</button>
                          </div>
                        </div>
                        <div style="background-color: #f5f5f5">
                          <div style="max-width: 560px; margin: auto; background-color: #f5f5f5">
                            <div style="background-color: #f5f5f5; font-size: 16px; text-align: center; padding: 40px 10px; margin: auto">
                              <p style="max-width: 480px; margin: auto; display: block">
                                Thousands of new jobs get added to Jobify every week, so don’t stop your job search just yet!
                              </p>
                              <button style="background-color: #383838; cursor: pointer; display: block; max-width: 160px; color: #fff; border: none; padding: 6px 10px; outline: 0; border-radius: 4px; margin: 20px auto 0; width: 100%; font-size: 16px">Find more jobs</button>
                            </div>
                          </div>
                        </div>
                        <div style="background-color: #383838">
                          <div style="max-width: 560px; margin: auto; background-color: #383838">
                            <div style="padding: 20px 10px; margin: auto; background-color: #383838; color: #fff; font-size: 14px; text-align: center;">
                              <p>You are receiving Jobify notification emails. This email was intended for ${userName}.</p>
                              <p>© 2019 Jobify, 182 Whitlock Drive, SW19 6SW, London.</p> 
                              <p>Registered in England and Wales no. 4740439</p>
                            </div>
                          </div>
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
                appliedJobs: user.myJobs.applied,
                notifications: user.notifications,
                newNotifications: user.newNotifications
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

router.post(
  '/profile/summary/avatar',
 //  checkAuth,
  multer({storage: storageAvatar}).single('avatar'), (req, res, next) => {
    const userId = req.body.userId;
    const url = req.protocol + '://' + req.get('host');
    User.findByIdAndUpdate(
      { _id: userId },
      { profile: {
          summary: {
            avatarPath: url + '/ftp/uploads/' + req.file.filename 
          }
        }  
      },
      { new: true }
    ).then(user => {
      if (user) {
        res.status(200).json({
          avatarPath: user.profile.summary.avatarPath
        });
      }
    }).catch(err => {
      console.log(err);
      res.status(401).json({
        message: 'Could not update avatar image'
      });
    });
});

router.post(
  '/profile/summary',
  // checkAuth,
  (req, res, next) => {
    const formData = req.body.formData;
    const userId = req.body.userId;
    User.findByIdAndUpdate(
      { _id: userId },
      { profile: {
          summary: {
            fname: formData.fname, 
            lname: formData.lname, 
            headling: formData.headline,
            country: formData.country,
            city: formData.city,
            number: formData.number 
          }
        }
      }, 
      { new: true }
    ).then(user => {
      if (user) {
        res.status(200).json({
          summary: user.profile.summary
        });
      }
    }).catch(err => {
      console.log(err);
      res.status(401).json({
        message: 'Could not update profile summary'
      });
    });
});

router.post(
  '/profile/education',
  // checkAuth
  (req, res, next) => {
    const formGroupId = req.body.formGroupId;
    const formData = req.body.formData;
    const userId = req.body.userId;
    User.find(
      { _id: userId,
       'profile.education': {
          $elemMatch: {
            id: formGroupId
          }
        } 
      }
    ).then(user => {
      if (user.length !== 0) {
        User.findByIdAndUpdate(
          { _id: userId },
          {
            $set: {
              profile: {
                education: {
                  id: formGroupId,
                  school: formData.school,
                  degree: formData.degree,
                  field_study: formData.field,
                  grade: formData.grade,
                  from_date: formData.from,
                  to_date: formData.to,
                  description: formData.description
                }
              }
            }
          },
          { new: true }
        ).then(user => {
       //   console.log(user);
          res.status(200).json({
            education: user.profile.education
          });
        });
      } else {
        User.findByIdAndUpdate(
          { _id: userId },
          { $addToSet: {
              'profile.education': {
                id: formGroupId,
                school: formData.school,
                degree: formData.degree,
                field_study: formData.field,
                grade: formData.grade,
                from_date: formData.from,
                to_date: formData.to,
                description: formData.description
              }
            }
          },
          { new: true }
        ).then(user => {
          console.log(user);
          res.status(200).json({
            education: user.profile.education
          });
        }).catch(err => {
          console.log(err);
          res.status(401).json({
            message: 'Could not update profile education'
          });
        });
      }
    }).catch(err => {
      console.log(err);
      res.status(401).json({
        message: 'Could not update profile education'
      });
    });   
});

router.post(
  '/profile/skills',
  // checkAuth,
  (req, res, next) => {
    const userId = req.body.userId;
    const skill = req.body.formData.skill;
    User.findByIdAndUpdate(
      { _id: userId },
      { $push: {
          'profile.skills':
              { date: new Date(), 
                skill: skill
              }
        }
      },
      { new: true }
    ).then(user => {
      console.log(user);
      res.status(200).json({
        skills: user.profile.skills
      });
    }).catch(err => {
      console.log(err);
      res.status(401).json({
        message: 'Could not add skill'
      });
    });
});

router.post(
  '/profile/skills/remove',
  // checkAuth,
  (req, res, next) => {
    const skillId = req.body.skillId;
    const userId = req.body.userId;
    User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { 'profile.skills': { _id: skillId } } },
      { new: true }
    ).then(response => {
      res.status(200).json({
        message: 'Skill removed'
      });
    }).catch(err => {
      console.log(err);
      res.status(401).json({
        message: 'Could not remove skill'
      });
    });
  }
);

router.post(
  '/notifications/clear',
  // checkAuth,
  (req, res, next) => {
    const userId = req.body.userId;
    User.findByIdAndUpdate(
      { _id: userId },
      { newNotifications: 0 },
      { new: true }
    ).then(user => {
      if (user) {
        console.log(user);
        res.status(200).json({
          notifications: user.notifications,
          newNotifications: user.newNotifications
        });
      }
    }).catch(err => {
      console.log(err);
      res.status(401).json({
        message: 'Could not clear notifications'
      });
    });
});

module.exports = router;