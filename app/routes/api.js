/**
 * api.js
 *
 * = TOC =
 * - Setup
 * - Auth Routes
 * - Middleware
 * - General Routes
 * - Project Routes
 * - Timer Routes
 * - User Routes
 */

// Setup ====================================
var bodyParser = require('body-parser'),
    User = require('../models/user'),
    Project = require('../models/project.js'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    config = require('../../config');

var secret = config.secret;

module.exports = function(app, express) {
    // api route
    var apiRouter = express.Router();

// Auth Routes =========================================================
    // to register a new sign up (POST http://localhost:8080/api/signup)
    apiRouter.post('/signup', function(req, res) {
        console.log('registering a newb');

        // validating parameters
        if (!req.body.email) {
            return res.json({
                success: false,
                message: 'Sign up failed. Email is required.'
            });
        } else if (!req.body.password) {
            return res.json({
                success: false,
                message: 'Sign up failed. Password is required.'
            });
        }

        // create new instance of User model
        var user = new User();
        // set the data from the request
        user.email = req.body.email;
        user.password = req.body.password;
        user.created = Date.now();

        user.save(function(err) {
            if (err) {
                console.log( err );
                if (err.code == 11000) {
                    return res.json({
                        success: false,
                        message: 'Sign up failed. Email is already in use.'
                    });
                } else {
                    return res.send(err);
                }
            }

            res.json({ success: true, message: 'User has signed up!' });
        });
    });

    // to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRouter.post('/authenticate', function(req, res) {
        console.log('post to authenticate');

        if (req.body.email) email = req.body.email;
        else return res.json({
            success: false,
            message: 'Authentication failed. Email is required.'
        });

        if (req.body.password) password = req.body.password;
        else return res.json({
            success: false,
            message: 'Authentication failed. Password is required.'
        });

        // find the user
        User.findOne({
            email: email
        }).select('_id email password').exec(function(err, user) {
            if (err) throw err;

            // there is no such user
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Email not found.'
                });
            } else if (user) {
                var validPassword = user.comparePassword(password);

                // user exists but password doesn't match
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    // user and password check out
                    var token = jwt.sign({
                        email: user.email,
                        _id: user._id
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

// Middleware ==========================
    // middleware to verify token
    apiRouter.use(function(req, res, next) {
        console.log('somebody is using our app!');

        // grab token from post params, url params, or the header
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    // send 403 - Forbidden if there is a problem with the token
                    return res.status(403).json({
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
            // send 401 - Unauthorized if there's no token
            return res.status(401).json({
                success: false,
                message: 'No token provided.'
            });
        }
    });

    // function for user access control
    function authorize(res, resource_id, current_id, resource) {
        if (resource_id != current_id) {
            return res.status(401).json({
                success: false,
                message: "Authorization failed. You do not have access to " + resource
            });
        } else {
            return true;
        }
    }

// General Routes ===============================
    // access at GET http://localhost:8080/api
    apiRouter.get('/', function(req, res) {
        res.json({ message: 'hooray!' });
    });

// Project Routes ===============================
    // for routes ending in /projects
    apiRouter.route('/projects')
        // get all projects for a user (accessed at GET http://localhost:8080/api/projects)
        .get(function(req, res) {
            Project.find({ user_id: req.decoded._id }, 'name unique_name', function(err, projects) {
                if (err) res.send(err);

                // return the projects
                res.json(projects);
            });
        })

        // create a project (accessed at POST http://localhost:8080/api/projects)
        .post(function(req, res) {
            if(!req.body.name) {
                return res.status(400).json({
                    success: false,
                    message: "Project creation failed. Name is required."
                });
            }

            // create a new instance of Project model
            var project = new Project();
            // set the data from the request
            project.name = req.body.name;
            project.user_id = req.decoded._id;
            project.unique_name = req.decoded._id + '_' + req.body.name;

            project.save(function(err) {
                if (err) {
                    console.log(err);
                    if (err.code == 11000) {
                        return res.status(400).json({
                            success: false,
                            message: 'A Project with that name already exists.'
                        });
                    } else {
                        return res.status(400).send(err);
                    }
                }

                res.status(201).json({
                    success: true,
                    message: 'Project created.'
                });
            });
        });

    // for routes ending in /projects/:project_id
    apiRouter.route('/projects/:project_id')
        // get the project with this id
        .get(function(req, res) {
            Project.findById(req.params.project_id, function(err, project) {
                if (err) res.send(err);

                if(project.user_id != req.decoded._id) {
                    return res.status(401).json({
                        success: false,
                        message: "Authorization failed. You do not have access to this project."
                    });
                }

                // return that project
                res.json(project);
            });
        })

        // update the project with this id
        .put(function(req, res) {
            Project.findById(req.params.project_id, function(err, project) {
                if (err) res.send(err);

                if(project.user_id != req.decoded._id) {
                    return res.status(401).json({
                        success: false,
                        message: "Authorization failed. You do not have access to this project."
                    });
                }

                // set the new project name if it exists in the request
                if (req.body.name) {
                    project.name = req.body.name;
                    project.unique_name = req.decoded._id + "_" + req.body.name;
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Update failed. Project name is required."
                    })
                }

                project.save(function(err) {
                    if (err) {
                        if (err.code == 11000) {
                            return res.status(400).json({
                                success: false,
                                message: 'Update failed. That project name already exists.'
                            });
                        } else {
                            return res.status(400).send(err);
                        }
                    }

                    // return confirmation message
                    res.status(201).json({
                        success: true,
                        message: 'Project updated.'
                    });
                });
            });
        })

        // delete the project with this id
        .delete(function(req, res) {
            Project.remove({ _id: req.params.project_id }, function(err, project) {
                if (err) return res.send(err);

                if(project.user_id != req.decoded._id) {
                    return res.status(401).json({
                        success: false,
                        message: "Authorization failed. You do not have access to this project."
                    });
                }

                // return confirmation message
                res.status(200).json({
                    success: true,
                    message: 'Project deleted.'
                });
            });
        });

// Timer Routes ===============================
    // for routes ending in /timer/:project_id
    apiRouter.route('/timer/:project_id')
        // get this project
        .get(function(req, res) {
            Project.findById(req.params.project_id, function(err, project) {
                if (err) res.send(err);

                if(project.user_id != req.decoded._id) {
                    return res.status(401).json({
                        success: false,
                        message: "Authorization failed. You do not have access to this project."
                    });
                }

                // return the project
                res.json(project);
            });
        })

        // toggle the timer for this project
        .put(function(req, res) {
            Project.findById(req.params.project_id, function(err, project) {
                if (err) res.send(err);

                if(project.user_id != req.decoded._id) {
                    return res.status(401).json({
                        success: false,
                        message: "Authorization failed. You do not have access to this project."
                    });
                }

                // check for running timer
                var timer_running = false;
                var last_timer = project.times[ project.times.length - 1 ];

                if (last_timer) {
                    // time exists
                    if (!last_timer.end) {
                        // time exists and is running
                        timer_running = true;
                    }
                }

                if (timer_running) {
                    last_timer.end = Date.now();
                    last_timer.total = last_timer.end - last_timer.start;

                    console.log( 'start: ' + last_timer.start );
                    console.log( 'end: ' + last_timer.end );
                    console.log( 'total: ' + last_timer.total );

                    project.save(function(err) {
                        if (err) return res.send(err);

                        res.json({
                            success: true,
                            message: 'Timer stopped.'
                        });
                    });
                } else {
                    // start timer
                    project.times.push({
                        start: Date.now(),
                        _id: mongoose.Types.ObjectId()
                    });

                    project.save(function(err) {
                        if (err) return res.send(err);

                        res.json({
                            success: true,
                            message: 'Timer started.'
                        });
                    });
                }
            });
        })

        // delete/cancel the timer for this project
        .delete(function(req, res) {
            Project.findById(req.params.project_id, function(err, project) {
                if (err) res.send(err);

                if(project.user_id != req.decoded._id) {
                    return res.status(401).json({
                        success: false,
                        message: "Authorization failed. You do not have access to this project."
                    });
                }

                // check for running timer
                var last_timer = project.times[ project.times.length - 1 ];
                if (!last_timer) {
                    // there is no timer for this project yet
                    return res.status(400).json({
                        success: false,
                        message: 'Delete failed. This project hasn\'t been timed yet.'
                    });
                } else if (last_timer.end) {
                    // the last timer has ended
                    return res.status(400).json({
                        success: false,
                        message: 'Delete failed. This project has no running timer.'
                    });
                } else {
                    // delete last time
                    project.times.pop();

                    project.save(function(err) {
                        if (err) return res.send(err);

                        res.json({
                            success: true,
                            message: 'Timer cancelled.'
                        });
                    });
                }
            });
        });

// User Routes ===============================
    // for routes ending in /users
    apiRouter.route('/users')
        // create a user (accessed at POST http://localhost:8080/api/users)
        /*
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
        */

        // get all users (accessed at GET http://localhost:8080/api/users)
        .get(function(req, res) {
            User.find({}, function(err, users) {
                if (err) res.send(err);

                // return the users
                res.json({ users: users });
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

                // TODO: add failure if no data was received

                // set the new user info if it exists in the request
                if (req.body.email) user.email = req.body.email;
                if (req.body.password) user.password = req.body.password;

                user.save(function(err) {
                    if (err) res.send(err);

                    // return confirmation message
                    res.json({ success: true, message: 'User updated.' });
                });
            });
        })

        // delete the user with this id
        .delete(function(req, res) {
            User.remove({ _id: req.params.user_id }, function(err, user) {
                if (err) return res.send(err);

                // return confirmation message
                res.json({ success: true, message: 'User deleted.' });
            });
        });

    // api endpoint to get user info
    //
    // Returns:
    // - email
    // - _id
    // - iat
    // - exp
    apiRouter.get('/me', function(req, res) {
        res.send(req.decoded);
    });

    return apiRouter;

};
