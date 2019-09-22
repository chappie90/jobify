  const express = require('express');

const Job = require('../models/job');
//const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', (req, res, next) => {
  console.log(req.query);
  const currentPage = +req.query.page;
  let title = req.query.title;
  let location = req.query.location;
  if (title === undefined) {
    title = '';
  }
  if (location === undefined) {
    location = '';
  }
  const pageSize = 20;
  let jobsQuery;
  jobsQuery = Job.find(
     { 
      job_title: { $regex: title, $options: 'i' },
      location: { $regex: location, $options: 'i' }
     }
  );
  let fetchedJobs;
  if (currentPage) {
    jobsQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  jobsQuery
    .then(jobs => {
      fetchedJobs = jobs;
      return Job.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Jobs sent from server successfully',
        jobs: fetchedJobs,
        totalJobs: count,
        currentPage: currentPage
      });
    });  
});

router.post('/saved', (req, res, next) => {
  const savedJobs = req.body.savedJobs;
  if (savedJobs) {
    Job.find({ _id: { $in: savedJobs } })
    .then(savedJobs => {
      res.status(200).json({
        savedJobs: savedJobs
      });
    });
  }
});

module.exports = router;