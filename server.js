/**
 * server.js
 */

// Setup ================
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('./config'),
    path = require('path');

// App Configuration =====
// body-parser will grab info from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    next();
});

// log all requests to console
app.use(morgan('dev'));

// connect to mongo on localhost
mongoose.connect(config.database);

// set static file location
app.use(express.static(__dirname + '/public'));

// Routes ================
// api route
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// main route
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// Finalize ==============
app.listen(config.port);

console.log( 'Magic is happening on port ' + config.port );
