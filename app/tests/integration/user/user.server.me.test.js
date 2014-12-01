// var app is a global variable.
// this ensure the application is only loaded once to run tests against

var supertest = require('supertest');
var nodeJwt = require('jsonwebtoken');
var expect = require('chai').expect;

describe('test users route: ', function () {
    beforeEach(function(){
      //console.log('before every test');
    });

  it('should give 200  when proctected route has valid token', function (done) {
    var options = {
      expiresInMinutes: config.tokenExpiryInMinutes
    };
    var token = nodeJwt.sign({ foo: 'bar' }, config.sessionSecret, options);
    //console.log(token);
    supertest(app)
    .get('/api/users/me')
    .set('Authorization', 'Bearer '+ token)
    .expect(200)
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.foo).to.exist();
      done();
    });

  });
});
