/**
 * api.js
 */

// Setup ===================
var bodyParser = require('body-parser'),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    config = require('../../config');

var secret = config.secret;

module.exports = function(app, express) {
    // api route
    var apiRouter = express.Router();

    // to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRouter.post('/authenticate', function(req, res) {
        console.log('post to authenticate');

        // find the user
        User.findOne({
            email: req.body.email
        }).select('email password').exec(function(err, user) {
            if (err) throw err;

            // there is no such user
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Email not found.'
                });
            } else if (user) {
                var validPassword = user.comparePassword(req.body.password);

                // user exists but password doesn't match
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    // user and password check out
                    var token = jwt.sign({
                        email: user.email
                    }, secret, {
                        // expires in 24 hours
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

    // middleware to verify token
    apiRouter.use(function(req, res, next) {
        console.log('somebody is using our app!');

        // grab token from post params, url params, or the header
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    return res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // verified token is saved to request for use in other routes
                    req.decoded = decoded;

                    next();
                }
            });
        } else {
            // send access forbidden if theres no token
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });

    // access at GET http://localhost:8080/api
    apiRouter.get('/', function(req, res) {
        res.json({ message: 'hooray!' });
    });

    // for routes ending in /users
    apiRouter.route('/users')
        // create a user (accessed at POST http://localhost:8080/api/users)
        .post(function(req, res) {
            // create new instance of User model
            var user = new User();
            // set the data from the request
            user.email = req.body.email;
            user.password = req.body.password;

            user.save(function(err) {
                if (err) {
                    console.log( err );
                    if (err.code == 11000) {
                        return res.json({
                            success: false,
                            message: 'A user with that email already exists. '
                        });
                    } else {
                        return res.send(err);
                    }
                }

                res.json({ message: 'User Created!' });
            });
        })

        // get all users (accessed at GET http://localhost:8080/api/users)
        .get(function(req, res) {
            User.find({}, function(err, users) {
                if (err) res.send(err);

                // return the users
                res.json(users);
            });
        });

    // for routes ending in /users/:user_id
    apiRouter.route('/users/:user_id')
        // get the user with this id
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) res.send(err);

                // return that user
                res.json(user);
            });
        })

        // update the user with this id
        .put(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) res.send(err);

                // set the new user info if it exists in the request
                if (req.body.email) user.email = req.body.email;
                if (req.body.password) user.password = req.body.password;

                user.save(function(err) {
                    if (err) res.send(err);

                    // return confirmation message
                    res.json({ message: 'User updated!' });
                });
            });
        })

        // delete the user with this id
        .delete(function(req, res) {
            User.remove({ _id: req.params.user_id }, function(err, user) {
                if (err) return res.send(err);

                // return confirmation message
                res.json({ message: 'Successfully deleted' });
            });
        });

    // api endpoint to get user info
    apiRouter.get('/me', function(req, res) {
        res.send(req.decoded);
    });

    return apiRouter;

};
