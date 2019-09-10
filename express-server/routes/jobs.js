const express = require('express');

const Job = require('../models/job');

const router = express.Router();

router.get('', (req, res, next) => {
  Job.find()
    .then(jobs => {
      console.log(jobs);
      res.status(200).json({
        message: 'Jobs sent from server successfully',
        jobs: jobs
      });
    });  
});

module.exports = router;