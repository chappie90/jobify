const express = require('express');

const Job = require('../models/job');

const router = express.Router();

router.get('', (req, res, next) => {
  const currentPage = +req.query.page;
  const pageSize = 20;
  const jobsQuery = Job.find();
  let fetchedJobs;
  if (currentPage) {
    jobsQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  jobsQuery
    .then(jobs => {
      fetchedJobs = jobs;
      return Job.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Jobs sent from server successfully',
        jobs: fetchedJobs,
        totalJobs: count
      });
    });  
});

module.exports = router;