  const express = require('express');

const Job = require('../models/job');
//const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', (req, res, next) => {
  const currentPage = +req.body.page;
  let title = req.body.form.title;
  let location = req.body.form.location;

  if (title === undefined) {
    title = '';
  }
  if (location === undefined) {
    location = '';
  }
  
  console.log(title);
  console.log(location);

  // // DATE JOBS SEARCH FILTER
  // const date = req.body.form.date;

  // let toDate = new Date(); // mm/dd/yyy
  // let ddToDate = String(toDate.getDate()).padStart(2, '0');
  // let mmToDate = String(toDate.getMonth() + 1).padStart(2, '0');
  // let yyyyToDate = toDate.getFullYear();
  // let toDateQuery = ddToDate + '/' + mmToDate + '/' + yyyyToDate;
  // // Maybe replace below with oldest jobs in db
  // // let fromDateQuery = Job.find().sort({ "date_posted" : 1 }).limit(1);
  // let fromDate = new Date();
  // let ddFromDate;
  // let mmFromDate;
  // let yyyyFromDate;
  // let fromDateQuery = '01/01/2000';

  // // RESULTS FROM LAST MONTH
  // if (date === 'month') {
  //   fromDate.setDate(toDate.getDate());
  //   fromDate.setMonth(toDate.getMonth() - 1);
  //   if (toDate.getMonth() === 0) {
  //     fromDate.setFullYear(toDate.getFullYear() - 1);
  //   } else {
  //     fromDate.setFullYear(toDate.getFullYear());
  //   }
  //   ddFromDate = String(fromDate.getDate()).padStart(2, '0');
  //   mmFromDate = String(fromDate.getMonth() + 1).padStart(2, '0');
  //   yyyyFromDate = fromDate.getFullYear();
  //   fromDateQuery = ddFromDate + '/' + mmFromDate + '/' + yyyyFromDate;
  // }

  // // RESULTS FROM LAST WEEK
  // if (date === 'week') {
  //   fromDate.setDate(toDate.getDate() - 7);
  //   if (toDate.getDate() < 7) {
  //     fromDate.setMonth(toDate.getMonth() - 1);
  //   } else {
  //     fromDate.setMonth(toDate.getMonth());
  //   }
  //   if (toDate.getMonth() === 0 && toDate.getDate() < 7) {
  //     fromDate.setFullYear(toDate.getFullYear() - 1);
  //   } else {
  //     fromDate.setFullYear(toDate.getFullYear());
  //   }
  //   ddFromDate = String(fromDate.getDate()).padStart(2, '0');
  //   mmFromDate = String(fromDate.getMonth() + 1).padStart(2, '0');
  //   yyyyFromDate = fromDate.getFullYear();
  //   fromDateQuery = ddFromDate + '/' + mmFromDate + '/' + yyyyFromDate;
  // }

  // // RESULTS FROM LAST 24 HOURS
  // if (date === 'day') {
  //   fromDate.setDate(toDate.getDate() - 1);
  //   if (toDate.getDate() === 1) {
  //     fromDate.setMonth(toDate.getMonth() - 1);
  //   } else {
  //     fromDate.setMonth(toDate.getMonth());
  //   }
  //   if (toDate.getMonth() === 0 && toDate.getDate() === 1) {
  //     fromDate.setFullYear(toDate.getFullYear() - 1);
  //   } else {
  //     fromDate.setFullYear(toDate.getFullYear());
  //   }
  //   ddFromDate = String(fromDate.getDate()).padStart(2, '0');
  //   mmFromDate = String(fromDate.getMonth() + 1).padStart(2, '0');
  //   yyyyFromDate = fromDate.getFullYear();
  //   fromDateQuery = ddFromDate + '/' + mmFromDate + '/' + yyyyFromDate;
  // }

  // // JOB TYPE JOBS SEARCH FILTER
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
  // }
  const pageSize = 20;
  let jobsQuery;
  jobsQuery = Job.find(
     {
      job_title: { $regex: title, $options: 'i' },
      location: { $regex: location, $options: 'i' },
      // job_type: { $in: [jobTypeArray] },
      // date_posted: { $lte: toDateQuery, $gte: fromDateQuery }
     }
  );
  let jobsQueryCount = Job.find(
     {
      job_title: { $regex: title, $options: 'i' },
      location: { $regex: location, $options: 'i' },
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

