/**
 * server.js
 */

// Setup ================
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    port = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost:27017/vili');

var User = require('./app/models/user.js');

// App Configuration =====
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \Authorization');

    next();
});

app.use(morgan('dev'));

// Routes ================
app.get('/', function(req, res) {
    // res.sendFile( path.join( __dirname + '/public/index.html' ));
    res.send('Welcome to the Home Page!');
});

var apiRouter = express.Router();

apiRouter.use(function(req, res, next) {
    console.log('somebody is using our app!');

    // more later

    next();
});

apiRouter.get('/', function(req, res) {
    res.json({ message: 'hooray!' });
});

// Register Routes =======
app.use('/api', apiRouter);

/*
app.route( '/login' )
    .get( function( req, res ) {
        res.send( 'this is the login form' );
    })

    .post( function( req, res ) {
        console.log( 'processing' );
        res.send( 'processing the login form' );
    });

var adminRouter = express.Router();

adminRouter.use( function( req, res, next ) {
    console.log( req.method, req.url );
    next();
});

adminRouter.get( '/', function( req, res ) {
    res.send( 'I am the dashboard' );
});

adminRouter.get( '/users', function( req, res ) {
    res.send( 'I show all the users' );
});

adminRouter.param( 'name', function( req, res, next, name ) {
    // validate name here
    console.log( 'doing name validation on ' + name );

    req.name = name;
    next();
});

adminRouter.get( '/users/:name', function( req, res ) {
    res.send( 'hello ' + req.name + '!' );
});

adminRouter.get( '/posts', function( req, res ) {
    res.send( 'I show all the posts' );
});

app.use( '/admin', adminRouter );
app.use( '/', basicRouter );
app.use( '/api', apiRoutes );*/

// Finalize ==============
app.listen( port );

console.log( 'Magic is happening on port ' + port );
