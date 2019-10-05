const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const serveIndex = require('serve-index');

const userRoutes = require('./routes/user');
const jobsRoutes = require('./routes/jobs');

const app = express();

mongoose.connect('mongodb+srv://stoyangarov:' + process.env.MONGO_ATLAS_PW + '@emaily-w8ewa.mongodb.net/jobify-dev?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection failed');
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();  
  });
  
  app.use('/api/jobs', jobsRoutes);
  app.use('/api/user', userRoutes);


module.exports = app;