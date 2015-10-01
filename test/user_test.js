var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:8080/api');

describe('Users', function() {
    it('should return 401 without authentication token', function(done) {
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

    it('should return 403 with incorrect authentication', function(done) {
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
    })
});
