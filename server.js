/**
 * server.js
 */

var express = require( 'express' ),
    app = express(),
    path = require( 'path' );

app.get( '/', function( req, res ) {
    res.sendFile( path.join( __dirname + '/public/index.html' ));
});

app.listen( 1337 );

console.log( 'Visit me at http://localhost:1337' );
