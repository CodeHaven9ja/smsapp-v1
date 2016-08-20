var express = require('express');
var gravatar = require('gravatar');
var router = express.Router();
var roleChecker = require('../../modules/role-check.js');

var returnRouter = function(parse){
	// Get all students
	router.get('/', noStudent, (req, res) => {
		res.status(200).json({
			users:[
				{name: 'Thompson'}
			]
		});
	});
	return router;
}
module.exports = returnRouter;

function noStudent(req, res, next) {
	if (roleChecker.isStudent(req.user)) {
		res.redirect('/home/noPermission');
	} else {
		next();
	}
}