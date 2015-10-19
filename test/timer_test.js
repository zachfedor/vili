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

describe('Timer', function() {
    var user1, user2, token1, token2,
        project1, project2;
    var project1_name = "Test Project 1";
    var project2_name = "Test Project 2";
    var timer = false;

    before('set up users and projects', function(done) {
        user1 = new User();
        user1.email = "user1@test.com";
        user1.password = "password";
        user1.created = Date.now();
        user1.save(function(err, user, number) {
            if (err) {
                console.log("Error Saving User 1: " + err);
            } else {
                project1 = new Project();
                project1.name = project1_name;
                project1.user_id = user1._id;
                project1.unique_name = user1._id + "_" + project1.name;
                project1.save(function(err) {
                    if (err) console.log("Error Saving Project 1: " + err);
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
        it('should return 401 without token', function(done) {
            api.get('/timer/' + project1._id)
            .set('Accept', 'application/json')
            .expect(401)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("No token provided.");

                done();
            });
        });

        it('should return 403 with incorrect token', function(done) {
            api.get('/timer/' + project1._id)
            .set('Accept', 'application/json')
            .set('x-access-token', 'bad_token')
            .expect(403)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Failed to authenticate token.");

                done();
            });
        });
    });

    describe('Routes', function() {
        it('should get a single project with no times', function(done) {
            api.get('/timer/' + project1._id)
            .set('Accept', 'application/json')
            .set('x-access-token', token1)
            .expect(200)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("name");
                expect(res.body.name).to.equal(project1.name);
                expect(res.body).to.have.property("user_id");
                expect(res.body.user_id).to.equal(String(user1._id));
                expect(res.body).to.have.property("unique_name");
                expect(res.body.unique_name).to.equal(user1._id + "_" + project1.name);
                expect(res.body).to.have.property("_id");
                expect(res.body._id).to.be.a("string");
                expect(res.body).to.have.property("times");
                expect(res.body.times).to.be.a("array");
                expect(res.body.times).to.be.empty;

                done();
            });
        });

        it('should fail at cancelling a timer on a clean project', function(done) {
            api.delete('/timer/' + project1._id)
            .set('x-access-token', token1)
            .expect(400)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Delete failed. This project hasn't been timed yet.");

                done();
            });
        });

        it('should start a new timer on a clean project', function(done) {
            api.put('/timer/' + project1._id)
            .set('x-access-token', token1)
            .expect(200)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Timer started.");

                timer = true;
                done();
            });
        });

        it('should stop the current timer on a project', function(done) {
            if(timer) {
                api.put('/timer/' + project1._id)
                .set('x-access-token', token1)
                .expect(200)
                .end(function(err, res) {
                    if(err) console.log(err);

                    expect(res.body).to.have.property("success");
                    expect(res.body.success).to.equal(true);
                    expect(res.body).to.have.property("message");
                    expect(res.body.message).to.equal("Timer stopped.");

                    done();
                });
            } else {
                done();
            }
        });

        it('should get a single project with a single time', function(done) {
            if(timer) {
                api.get('/timer/' + project1._id)
                .set('Accept', 'application/json')
                .set('x-access-token', token1)
                .expect(200)
                .end(function(err, res) {
                    if(err) console.log(err);

                    expect(res.body).to.have.property("times");
                    expect(res.body.times).to.be.a("array");
                    expect(res.body.times.length).to.equal(1);
                    expect(res.body.times[0]).to.have.property("start");
                    expect(res.body.times[0].start).to.be.a("string");
                    expect(res.body.times[0]).to.have.property("end");
                    expect(res.body.times[0].end).to.be.a("string");
                    expect(res.body.times[0]).to.have.property("total");
                    expect(res.body.times[0].total).to.be.a("number");
                    // end minus start equals total
                    total = Date.parse(res.body.times[0].end) - Date.parse(res.body.times[0].start);
                    expect(res.body.times[0].total).to.equal(total);
                    expect(res.body.times[0]).to.have.property("_id");
                    expect(res.body.times[0]._id).to.be.a("string");

                    timer = false;
                    done();
                });
            } else {
                done();
            }
        });

        it('should fail at cancelling a non-running timer', function(done) {
            api.delete('/timer/' + project1._id)
            .set('x-access-token', token1)
            .expect(400)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Delete failed. This project has no running timer.");

                done();
            });
        });

        it('should start a running timer to cancel', function(done) {
            api.put('/timer/' + project1._id)
            .set('x-access-token', token1)
            .expect(200)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Timer started.");

                it('should cancel the running timer', function(done) {
                    api.delete('/timer/' + project1._id)
                    .set('x-access-token', token1)
                    .expect(200)
                    .end(function(err, res) {
                        if(err) console.log(err);

                        expect(res.body).to.have.property("success");
                        expect(res.body.success).to.equal(true);
                        expect(res.body).to.have.property("message");
                        expect(res.body.message).to.equal("Timer cancelled.");

                        done();
                    });
                });

                done();
            });
        });
    });

    describe('Different Users', function() {
        it('should not see other\'s projects', function(done) {
            api.get('/timer/' + project1._id)
            .set('Accept', 'application/json')
            .set('x-access-token', token2)
            .expect(401)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Authorization failed. You do not have access to this project.");

                done();
            });
        });

        it('should not toggle timers on other\'s projects', function(done) {
            api.put('/timer/' + project1._id)
            .set('Accept', 'application/json')
            .set('x-access-token', token2)
            .expect(401)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Authorization failed. You do not have access to this project.");

                done();
            });
        });

        it('should not cancel timers on other\'s projects', function(done) {
            api.delete('/timer/' + project1._id)
            .set('Accept', 'application/json')
            .set('x-access-token', token2)
            .expect(401)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Authorization failed. You do not have access to this project.");

                done();
            });
        });
    });

    after('teardown all users and projects', function(done) {
        if (User.find({ _id: user1._id })) {
            User.remove({ _id: user1._id }, function(err, user) {
                if(err) console.log(err);
            });
        }

        if (User.find({ _id: user2._id })) {
            User.remove({ _id: user2._id }, function(err, user) {
                if(err) console.log(err);
            });
        }

        if (Project.find({ _id: project1._id })) {
            Project.remove({ _id: project1._id }, function(err) {
                if(err) console.log(err);
            });
        }

        done();
    });
});
