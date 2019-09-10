#!/usr/bin/env node

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const utils = require('./utils');

const app = express();
const models = require('./models');
const apiRouter = require('./api');

const ENV_DEVELOPMENT = process.env.NODE_ENV === 'development';
const ENV_PRODUCTION = process.env.NODE_ENV === 'production';
const ENV_TESTING = process.env.NODE_ENV === 'testing';

app.use(logger(ENV_PRODUCTION ? 'common' : 'dev'));
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, '..', 'static', 'images', 'favicon', 'favicon.ico')));

// Set up static paths - ideally a reverse proxy would handle this & favicon
app.use('/styles', express.static(path.join(__dirname, '..', 'static', 'styles')));
app.use('/images/', express.static(path.join(__dirname, '..', 'static', 'images')));
app.use(express.static(path.join(__dirname, '..', 'uploads')));

// Webpack middleware for use in development
if (ENV_DEVELOPMENT || ENV_TESTING) {
  utils.log('Setting up webpack-dev-middleware')
  const webpack = require('webpack');
  const config = require('../webpack.config.js');
  const compiler = webpack(config);
  const webpackDevMiddleware = require('webpack-dev-middleware');
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }));
} else {
  app.use('/build', express.static(path.join(__dirname, '..', 'build')));
}

// Make models available to middleware
app.use((req, res, next) => {
  req.db = models;
  next();
});

// Set up API route
app.use('/api', apiRouter);

// Forward all other requests to index.html for Vue routing
app.use((req, res) => res.sendFile(path.join(__dirname, '..', 'src',
  'app.html')));

// Error handler
app.use(function (err, req, res, next) {
  utils.error('Error in reqest: ' + err + err.stack);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

// Listen for requests
if (!ENV_TESTING) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => utils.log('Started listening on port ' + port));
}

// Save & output bootstrap key for bootstrapping the data
const SERVER_URL = '';
utils.randomString()
  .then(key => {
    app.set('bootstrapKey', key);
    utils.log('Use the following link to add users: ' + SERVER_URL + '/admin?key=' + key);
  })
  .catch(err => utils.error('Error generating random string: ' + err));
