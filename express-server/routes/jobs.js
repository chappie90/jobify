const express = require('express');

const Job = require('../models/job');

const router = express.Router();

router.get('', (req, res, next) => {
  const currentPage = +req.query.page;
  const pageSize = 20;
  const jobsQuery = Job.find();
  if (currentPage) {
    jobsQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  jobsQuery
    .then(jobs => {
      console.log(jobs);
      res.status(200).json({
        message: 'Jobs sent from server successfully',
        jobs: jobs
      });
    });  
});

module.exports = router;