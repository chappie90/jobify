const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://stoyangarov:Daspak12@emaily-w8ewa.mongodb.net/jobify-dev?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection failed');
  });

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();  
  });

module.exports = app;