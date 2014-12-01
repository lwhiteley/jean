'use strict';

// var app is a global variable.
// this ensure the application is only loaded once to run tests against

var supertest = require('supertest');
var expect = require('chai').expect;

describe('test core jwt scenarios: ', function () {
  beforeEach(function(){
    //console.log('before every test');
  });


  it('should throw 500 when proctected route has no token', function (done) {
    supertest(app)
    .get('/api/users/me')
    .expect(500)
    .end(function (err, res) {
      expect(err).to.eql(null);
      done();
    });

  });

  it('should give 500 error when proctected route has bad token without Bearer', function (done) {

    var badJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSIsImFkbWluIjp0cnVlfQ.'+
    'eoaDVGTClRdfxUZXiPs3f8FmJDkDE_VCQFXqKxpLsts';
    supertest(app)
    .get('/api/users/me')
    .set('Authorization', badJwt)
    .expect(500)
    .end(function (err, res) {
      expect(err).to.eql(null);
      //console.log(err);
      done();
    });

  });

  it('should give 500 error when proctected route has bad token with invalid signature', function (done) {

    var badJwt = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSIsImFkbWluIjp0cnVlfQ.'+
    'eoaDVGTClRdfxUZXiPs3f8FmJDkDE_VCQFXqKxpLsts';
    supertest(app)
    .get('/api/users/me')
    .set('Authorization', badJwt)
    .expect(500)
    .end(function (err, res) {
      expect(err).to.eql(null);
      //console.log('test err' ,err);
      done();
    });

  });
});
