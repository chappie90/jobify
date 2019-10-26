const express = require('express');
const moment = require('moment');

const Job = require('../models/job');
//const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', (req, res, next) => {
  const currentPage = +req.body.page;
  let title = req.body.form.title;
  let location = req.body.form.location;

  // DATE JOBS SEARCH FILTER
  const date = req.body.form.date;

  // Get current date
  let today = moment().toDate();
  let fromDate = moment('01/01/2000', "YYYY-MM-DD").toDate();

  // RESULTS FROM LAST MONTH
  if (date === 'month') {
    fromDate = moment().subtract(1, 'months');
  }

  // RESULTS FROM LAST WEEK
  if (date === 'week') {
    fromDate = moment().subtract(1, 'weeks'); 
  }

  // RESULTS FROM LAST 24 HOURS
  if (date === 'day') {
    fromDate = moment().subtract(1, 'days');
  }

  console.log(today);
  console.log(fromDate);

  // // // JOB TYPE JOBS SEARCH FILTER
  // let jobTypeArray = ['Full-time'];
  // if (req.body.form.full) {
  //   jobTypeArray.push('Full-time');
  // }
  // if (req.body.form.part) {
  //   jobTypeArray.push('Part-time');
  // }
  // console.log(jobTypeArray);

  // let jobTypeFull = '';
  // if (req.body.form.full) {
  //   jobTypeFull = 'Full-time';
  // }
  // let jobTypePart = '';
  // if (req.body.form.part) {
  //   jobTypePart = 'Part-time';
  // }
  // let jobTypeContract = '';
  // if (req.body.form.contract) {
  //   jobTypeContract = 'Contract';
  // // }


  const pageSize = 20;
  let jobsQuery;
  jobsQuery = Job.find(
     {
      job_title: { $regex: title, $options: 'i' },
      location: { $regex: location, $options: 'i' },
      // job_type: { $in: [jobTypeArray] },
      date_posted: { $lte: today.toISOString(), $gte: fromDate.toISOString() }
     }
  );
  let jobsQueryCount = Job.find(
     {
      job_title: { $regex: title, $options: 'i' },
      location: { $regex: location, $options: 'i' },
      date_posted: { $lte: today.toISOString(), $gte: fromDate.toISOString() }
     }
  ).count();
  let fetchedJobs;
  if (currentPage) {
    jobsQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  jobsQuery
    .then(jobs => {
      fetchedJobs = jobs;
      return jobsQueryCount;
    })
    .then(count => {
      console.log(count);
      res.status(200).json({
        message: 'Jobs sent from server successfully',
        jobs: fetchedJobs,
        totalJobs: count,
        currentPage: currentPage
      });
    });  
});

router.post('/titles', (req, res, next) => {
  // Job.find({ job_title: { $regex: req.body.title, $options: 'i' } }).limit(10)
   Job.aggregate(
      [
        { '$group': { '_id': '$job_title', 'job_title': { $regex: req.body.title, $options: 'i' }} },
        { '$limit': 10 }
      ]
    )
    .then(jobs => {
      res.status(200).json({
        jobs: jobs
      })
      .catch(err => {
        console.log(err);
        res.status(401).json({
          message: 'Could not find any titles'
        });
      });
    })
});

router.get('/apply', (req, res, next) => {
  const jobId = req.query.id;
  if (jobId) {
    Job.find({ _id: jobId })
      .then(job => {
        res.status(200).json({
          job: job
        });
      })
      .catch(err => {
        console.log(err);
        res.status(401).json({
          message: 'Could not find job'
        });
      });
  }
});

router.post('/my-jobs', (req, res, next) => {
  const type = req.body.type;
  const myJobs = req.body.myJobs;
  if (type === 'saved') {
    Job.find({ _id: { $in: myJobs } })
    .then(myJobsData => {
      res.status(200).json({
        type: type,
        myJobs: myJobsData
      });
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({
        message: 'Could not fetch saved jobs'
      });
    });
  }
  if (type === 'applied') {
    Job.find({ _id: { $in: myJobs } })
    .then(myJobsData => {
      res.status(200).json({
        type: type,
        myJobs: myJobsData
      });
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({
        message: 'Could not fetch saved jobs'
      });
    });
  }

});

module.exports = router;

