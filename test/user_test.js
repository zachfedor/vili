var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:8080/api');

describe('User', function() {
    var user_email = 'email@test.com';
    var user_pass = 'password';
    var token, user_id;

    describe('Without Authentication', function() {
        it('should return 401 without token', function(done) {
            api.get('/users')
            .set('Accept', 'application/json')
            .expect(401)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("No token provided.");
                done();
            });
        });

        it('should return 403 with incorrect token', function(done) {
            api.get('/users')
            .set('Accept', 'application/json')
            .set('x-access-token', 'bad_token')
            .expect(403)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Failed to authenticate token.");
                done();
            });
        });
    });

    describe('Signup', function() {
        it('should return 403 without email', function(done) {
            api.post('/signup')
            .send({ email: '', password: user_pass })
            .set('Accept', 'application/json')
            .expect(403)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Sign up failed. Email is required.");
                done();
            });
        });

        it('should return 403 without password', function(done) {
            api.post('/signup')
            .send({ email: user_email, password: '' })
            .set('Accept', 'application/json')
            .expect(403)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Sign up failed. Password is required.");
                done();
            });
        });

        it('should return 201 on completed signup', function(done) {
            api.post('/signup')
            .send({ email: user_email, password: user_pass })
            .set('Accept', 'application/json')
            .expect(201)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("User has signed up!");
                done();
            });
        });

        it('should return 500 on duplicate signup', function(done) {
            api.post('/signup')
            .send({ email: user_email, password: user_pass })
            .set('Accept', 'application/json')
            .expect(500)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Sign up failed. Email is already in use.");
                done();
            })
        });

        after('authenticate and delete new user', function(done) {
            cleanUser(user_email, user_pass, done);
        });
    });

    describe('Authentication', function() {
        before('signup user', function(done) {
            api.post('/signup')
            .send({ email: user_email, password: user_pass })
            .set('Accept', 'application/json')
            .expect(201)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("User has signed up!");
                done();
            });
        });

        it('should return 403 without email', function(done) {
            api.post('/authenticate')
            .set('Accept', 'application/json')
            .send({ email: "", password: user_pass })
            .expect(403)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Authentication failed. Email is required.");
                done();
            });
        });

        it('should return 403 without password', function(done) {
            api.post('/authenticate')
            .set('Accept', 'application/json')
            .send({ email: user_email, password: "" })
            .expect(403)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Authentication failed. Password is required.");
                done();
            });
        });

        it("should return 403 if email isn't found", function(done) {
            api.post('/authenticate')
            .set('Accept', 'application/json')
            .send({ email: "somestringthatshouldntexist@email.com", password: user_pass })
            .expect(403)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Authentication failed. Email not found.");
                done();
            });
        });

        it("should return 403 if password doesn't match", function(done) {
            api.post('/authenticate')
            .set('Accept', 'application/json')
            .send({ email: user_email, password: "bad_password" })
            .expect(403)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(false);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Authentication failed. Wrong password.");
                done();
            });
        });

        it("should retun 200 with proper credentials", function(done) {
            api.post('/authenticate')
            .set('Accept', 'application/json')
            .send({ email: user_email, password: user_pass })
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Enjoy your token!");
                expect(res.body).to.have.property("token");
                expect(res.body.token).to.be.a("string");
                done();
            });
        })

        after('authenticate and delete user', function(done) {
            cleanUser(user_email, user_pass, done);
        });
    });

    describe('Routes', function() {
        var deleted = false;

        before('signup and authenticate new user', function(done) {
            api.post('/signup')
            .send({ email: user_email, password: user_pass })
            .set('Accept', 'application/json')
            .expect(201)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("User has signed up!");

                api.post('/authenticate')
                .set('Accept', 'application/json')
                .send({ email: user_email, password: user_pass })
                .expect(200)
                .end(function(err, res) {
                    expect(res.body).to.have.property("success");
                    expect(res.body.success).to.equal(true);
                    expect(res.body).to.have.property("message");
                    expect(res.body.message).to.equal("Enjoy your token!");
                    expect(res.body).to.have.property("token");
                    expect(res.body.token).to.be.a('string');

                    token = res.body.token;

                    done();
                });
            });
        });

        it('should return all users', function(done) {
            api.get('/users')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.have.property("users");
                done();
            });
        });

        it('should return the current user', function(done) {
            api.get('/me')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.have.property("email");
                expect(res.body.email).to.equal(user_email);
                expect(res.body).to.have.property("_id");
                expect(res.body._id).to.be.a("string");
                expect(res.body).to.have.property("iat");
                expect(res.body.iat).to.be.a("number");
                expect(res.body).to.have.property("exp");
                expect(res.body.exp).to.be.a("number");

                user_id = res.body._id;

                done();
            });
        });

        it('should return a user', function(done) {
            api.get('/users/' + user_id)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.have.property("_id");
                expect(res.body._id).to.be.a("string");
                expect(res.body).to.have.property("email");
                expect(res.body.email).to.equal(user_email);
                expect(res.body).to.have.property("created");
                expect(res.body.created).to.be.a("string");
                done();
            });
        });

        it('should update the user with new info', function(done) {
            api.put('/users/' + user_id)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .send({ email: "new_email@test.com", password: "new_password" })
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("User updated.");
                done();
            });
        });

        it('should delete the user', function(done) {
            api.delete('/users/' + user_id)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.have.property("success");
                expect(res.body.success).to.equal(true);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("User deleted.");

                if(res.body.success) {
                    deleted = true;
                }

                done();
            });
        });

        after('authenticate and delete new user', function(done) {
            if(!deleted) {
                cleanUser(user_email, user_pass, done);
            } else {
                done();
            }
        });
    });
});

function cleanUser(user_email, user_pass, done) {
    // authenticate the user we may have just signed up
    api.post('/authenticate')
    .send({ email: user_email, password: user_pass })
    .set('Accept', 'application')
    .expect(200)
    .end(function(err, res) {
        expect(res.body).to.have.property("success");
        expect(res.body.success).to.equal(true);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Enjoy your token!");
        expect(res.body).to.have.property("token");
        expect(res.body.token).to.be.a('string');

        if(res.body.success) {
            // if the user has signed up, save the token
            token = res.body.token;

            // and get their id
            api.get('/me')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.have.property("_id");

                // delete them using their token and id
                api.delete('/users/' + res.body._id)
                .set('Accept', 'application')
                .set('x-access-token', token)
                .end(function(err, res) {
                    expect(res.body).to.have.property("success");
                    expect(res.body.success).to.equal(true);
                    expect(res.body).to.have.property("message");
                    expect(res.body.message).to.equal("User deleted.");
                    done();
                });
            });
        } else {
            done();
        }
    });
}
