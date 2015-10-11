// imports for testing
var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:8080/api');

// imports for database functions
var Project = require('../app/models/project.js'),
    User = require('../app/models/user.js'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    config = require('../config');

describe('Project', function() {
    var user1, user2, token1, token2,
        project1_1, project1_2, project2_1, project2_2;
    var project1_name = "Test Project 1";
    var project2_name = "Test Project 2";

    before('set up users and projects', function(done) {
        // connect to mongo on localhost
        mongoose.connect(config.database);

        user1 = new User();
        user1.email = "user1@test.com";
        user1.password = "password";
        user1.created = Date.now();
        user1.save(function(err, user, number) {
            if (err) {
                console.log("Error Saving User 1: " + err);
            } else {
                project1_1 = new Project();
                project1_1.name = project1_name;
                project1_1.user_id = user1._id;
                project1_1.unique_name = user1._id + "_" + project1_1.name;
                project1_1.save(function(err) {
                    if (err) console.log("Error Saving User 1 Project 1: " + err);
                });

                token1 = jwt.sign({
                    email: user1.email,
                    _id: user1._id
                }, config.secret, {
                    // expires in 24 hours
                    expiresInMinutes: 1440
                });
            }
        });

        user2 = new User();
        user2.email = "user2@test.com";
        user2.password = "password";
        user2.created = Date.now();
        user2.save(function(err, user, number) {
            if(err) {
                console.log("Error Saving User 2: " + err);
            } else {
                project2_1 = new Project();
                project2_1.name = project1_name;
                project2_1.user_id = user2._id;
                project2_1.unique_name = user2._id + "_" + project2_1.name;
                project2_1.save(function(err) {
                    if (err) console.log("Error Saving User 2 Project 1: " + err);
                });

                token2 = jwt.sign({
                    email: user2.email,
                    _id: user2._id
                }, config.secret, {
                    // expires in 24 hours
                    expiresInMinutes: 1440
                });
            }
        });

        done();
    });

    describe('Without Authentication', function() {
