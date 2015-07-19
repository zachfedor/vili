/**
 * server.js
 */

// Setup ================
var express = require( 'express' ),
    app = express(),
    path = require( 'path' );

app.get( '/', function( req, res ) {
    res.sendFile( path.join( __dirname + '/public/index.html' ));
});

// Routes ================
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
/*app.use( '/', basicRouter );
app.use( '/api', apiRoutes );*/

// Finalize ==============
app.listen( 1337 );

console.log( 'Visit me at http://localhost:1337' );
