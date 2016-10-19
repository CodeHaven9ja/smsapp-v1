var app = require('./helpers/app');

var should = require('should'),
		supertest = require('supertest');

var token = process.env.LOCAL_TOKEN_SMS;

describe('Staff', function () {

	it('Staff resource should be available', function(done){
		supertest(app)
		.get('/staff')
		.expect(200)
		.end(function(err, res){
			res.status.should.equal(200);
			res.body.should.be.array;
			done();
		});
	});

});