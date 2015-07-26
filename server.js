/**
 * server.js
 */

// Setup ================
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    port = process.env.PORT || 8080;

mongoose.connect('mongodb://127.0.0.1:27017/vili');

// authorization
var secret = 'ilovescotchscotchyscotchscotch';

/*
// mongoose debugging
var db = mongoose.connection;
db.on('error', console.error.bind( console, 'connection error: '));
db.once('open', function(cb) {
    console.log( 'database has connected' );
});
*/

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
// basic route
app.get('/', function(req, res) {
    // res.sendFile( path.join( __dirname + '/public/index.html' ));
    res.send('Welcome to the Home Page!');
});

// api route
var apiRouter = express.Router();

apiRouter.post('/authenticate', function(req, res) {
    User.findOne({
        email: req.body.email
    })
        .select('email password')
        .exec(function(err, user) {
            if (err) throw err;

            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Email not found.'
                });
            } else if (user) {
                var validPassword = user.comparePassword(req.body.password);

                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    var token = jwt.sign({
                        email: user.email
                    }, secret, {
                        expiresInMinutes: 1440
                    });

                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
});

apiRouter.use(function(req, res, next) {
    console.log('somebody is using our app!');

    // more later

    next();
});

apiRouter.get('/', function(req, res) {
    res.json({ message: 'hooray!' });
});

apiRouter.route('/users')
// create a user (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {
        var user = new User();
        user.email = req.body.email;
        user.password = req.body.password;

        user.save(function(err) {
            if (err) {
                if (err.code == 11000) {
                    return res.json({
                        success: false,
                        message: 'A user with that username already exists. '
                    });
                }

                return res.send(err);
            }

            res.json({ message: 'User Created!' });
        });
    })

// get all users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) res.send(err);

            res.json(users);
        });
    });

apiRouter.route('/users/:user_id')
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);

            res.json(user);
        });
    })
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);

            if (req.body.email) user.email = req.body.email;
            if (req.body.password) user.password = req.body.password;

            user.save(function(err) {
                if (err) res.send(err);

                res.json({ message: 'User updated!' });
            });
        });
    })
    .delete(function(req, res) {
        User.remove({ _id: req.params.user_id }, function(err, user) {
            if (err) return res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
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

//console.log(mongoose.connection.readyState);
