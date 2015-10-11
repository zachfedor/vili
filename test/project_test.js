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
        it('should return 401 without token', function(done) {
            api.get('/projects')
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
            api.get('/projects')
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

    describe('Generic Routes', function() {
        it('should get a list of projects', function(done) {
            api.get('/projects')
            .set('Accept', 'application/json')
            .set('x-access-token', token1)
            .expect(200)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.be.a("array");
                expect(res.body[0]).to.be.a("object");
                expect(res.body[0]).to.have.property("name");
                expect(res.body[0].name).to.equal(project1_name);
                expect(res.body[0]).to.have.property("unique_name");
                expect(res.body[0].unique_name).to.equal(user1._id + "_" + project1_name);

                done();
            });
        });

        it('should create a new project', function(done) {
            api.post('/projects')
            .set('x-access-token', token1)
            .send({ name: project2_name })
            .expect(201)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Project created.");

                // set project1_2 so that it gets deleted during teardown
                project1_2 = true;

                done();
            });
        });

        it('should fail at creating a duplicate project', function(done) {
            api.post('/projects')
            .set('x-access-token', token1)
            .send({ name: project2_name })
            .expect(400)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("A Project with that name already exists.");

                done();
            });
        });

        it('should fail at creating a project without a name', function(done) {
            api.post('/projects')
            .set('x-access-token', token1)
            .send({ name: "" })
            .expect(400)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Project creation failed. Name is required.");

                done();
            });
        });
    });

    describe('Specific Routes', function() {
        it('should get a single project', function(done) {
            api.get('/projects/' + project1_1._id)
            .set('Accept', 'application/json')
            .set('x-access-token', token1)
            .expect(200)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("name");
                expect(res.body.name).to.equal(project1_1.name);
                expect(res.body).to.have.property("user_id");
                expect(res.body.user_id).to.equal(String(user1._id));
                expect(res.body).to.have.property("unique_name");
                expect(res.body.unique_name).to.equal(user1._id + "_" + project1_1.name);
                expect(res.body).to.have.property("_id");
                expect(res.body._id).to.be.a("string");
                expect(res.body).to.have.property("times");
                expect(res.body.times).to.be.a("array");

                done();
            });
        });

        it('should fail at updating a project without data', function(done) {
            api.put('/projects/' + project1_1._id)
            .set('x-access-token', token1)
            .send({ name: "" })
            .expect(400)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Update failed. Project name is required.");

                done();
            });
        });

        it('should fail at updating a project with an existing name', function(done) {
            api.put('/projects/' + project1_1._id)
            .set('x-access-token', token1)
            .send({ name: project2_name })
            .expect(400)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Update failed. That project name already exists.");

                done();
            });
        });

        it('should update a project name', function(done) {
            api.put('/projects/' + project1_1._id)
            .set('x-access-token', token1)
            .send({ name: project1_1.name + " Edit" })
            .expect(201)
            .end(function(err, res) {
                if(err) console.log(err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Project updated.");

                done();
            });
        });

        if(project1_2) {
            console.log("project1_2 exsits, delete now");

            it('should delete a single project', function(done) {
                api.delete('/projects/' + project1_2._id)
                .set('Accept', 'application/json')
                .set('x-access-token', token1)
                .expect(200)
                .end(function(err, res) {
                    if(err) console.log(err);

                    expect(res.body).to.have.property("success");
                    expect(res.body.success).to.equal(true);
                    expect(res.body).to.have.property("message");
                    expect(res.body.message).to.equal("Project deleted.");

                    done();
                });
            });
        }
    });

    describe('Different Users', function() {
        it('should not see other\'s projects', function(done) {
            api.get('/projects/' + project1_1._id)
            .set('Access', 'application/json')
            .set('x-access-token', token2)
            .expect(401)
            .end(function(err, res) {
                if(err) console.log("err: " + err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Authorization failed. You do not have access to this project.");

                done();
            });
        });

        it('should not update other\'s projects', function(done) {
            api.put('/projects/' + project1_1._id)
            .set('x-access-token', token2)
            .send({ name: "Some Project Name" })
            .expect(401)
            .end(function(err, res) {
                if(err) console.log("err: " + err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Authorization failed. You do not have access to this project.");

                done();
            });
        });

        it('should not delete other\'s projects', function(done) {
            api.delete('/projects/' + project1_1._id)
            .set('Access', 'application/json')
            .set('x-access-token', token2)
            .expect(401)
            .end(function(err, res) {
                if(err) console.log("err: " + err);

                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Authorization failed. You do not have access to this project.");

                done();
            });
        });

        // TODO: find some way to check database for projects of deleted users
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

        if (Project.find({ _id: project1_1._id })) {
            Project.remove({ _id: project1_1._id }, function(err) {
                if(err) console.log(err);
            });
        }

        // if (Project.find({ _id: project1_2._id })) {
        //     Project.remove({ _id: project1_2._id }, function(err) {
        //         if(err) console.log(err);
        //     });
        // }

        if (Project.find({ _id: project2_1._id })) {
            Project.remove({ _id: project2_1._id }, function(err) {
                if(err) console.log(err);
            });
        }

        // if (project2_2 && Project.find({ _id: project2_2._id })) {
        //     Project.remove({ _id: project2_2._id }, function(err) {
        //         if(err) console.log(err);
        //     });
        // }

        done();
    });
});
