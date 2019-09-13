const express = require('express');

const Job = require('../models/job');

const router = express.Router();

router.get('', (req, res, next) => {
  console.log(req.query);
  const currentPage = +req.query.page;
  console.log(currentPage);
  const title = req.query.title;
  const location = req.query.location;
  const pageSize = 20;
  let jobsQuery;
  if (title || location) {
    jobsQuery = Job.find(
       { job_title: { $regex: title, $options: 'i' } }
    );
  } else {
    jobsQuery = Job.find();
  }
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
        totalJobs: count,
        currentPage: currentPage
      });
    });  
});

module.exports = router;