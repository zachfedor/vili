var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:8080/api');

describe('Project', function() {
    var user1_email = "user1@test.com";
    var user2_email = "user2@test.com";
    var user_pass = "password";
    var token1, token2, user1_id, user2_id;

    // before('set up users and projects');

    describe('Without Authentication', function() {
        it('should return 401 without token', function(done) {
            api.get('/projects')
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
            api.get('/projects')
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

    describe('Generic Routes', function() {
        it('should get a list of projects');

        it('should create a new project');

        it('should fail at creating a duplicate project');

        it('should fail at creating a project without a name');
    });

    describe('Specific Routes', function() {
        it('should get a single project');

        it('should update a project name');

        it('should fail at updating a project with an existing name');

        it('should fail at updating a project without data');

        it('should delete a single project');
    });

    describe('Different Users', function() {
        it('should not see other\'s projects');

        it('should not see other\s single project');

        it('should not update other\'s projects');

        it('should not delete other\'s projects');

        // TODO: find some way to check database for projects of deleted users
    });

    // after('teardown all users and projects');
});
