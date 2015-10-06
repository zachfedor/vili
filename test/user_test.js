var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:8080/api');

describe('User', function() {
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
        var user_email = 'email@test.com';
        var user_pass = 'password';

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

        it('should return 500 on duplicate signup');

        after('authenticate and delete new user', function(done) {
            cleanUser(user_email, user_pass, done);
        });
    });

    describe('Authentication', function() {
        // before('signup user'); ???

        it('should return 403 without email');

        it('should return 403 without password');

        it('should return 403 if email isn\'t found');

        it('should return 403 if password doesn\t match');

        // after('authenticate and delete user');
    });

    describe('Base Routes', function() {
        // before('signup and authenticate new user');

        it('should return 200 with proper authentication');

        // after('authenticate and delete new user');
    });

    describe('/_id Routes', function() {
        // beforeEach('signup and authenticate new user');

        it('should return 200 with proper authentication');

        it('should update the user with new info');

        it('should delete the user');

        // afterEach('authenticate and delete new user');
    });
});

function cleanUser(user_email, user_pass, done) {
    // authenticate the user we may have just signed up
    api.post('/authenticate')
    .send({ email: user_email, password: user_pass })
    .set('Accept', 'application')
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
                    expect(res.body.message).to.equal("Successfully deleted.");
                    done();
                });
            });
        } else {
            done();
        }
    });
}
