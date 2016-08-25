var express = require('express');
var gravatar = require('gravatar');
var router = express.Router();
var roleChecker = require('../../modules/role-check.js');

var returnRouter = function(parse){
	// Get all students
	router.get('/', noStudent, getAllStudents);
	router.get('/:studentId', getStudent);
	router.get('/:studentId/attendance', getStudentAttendance);
	router.get('/:studentId/work', getStudentClassWork);
	router.get('/:studentId/timetable', getStudentTimeTable);
	return router;
}
module.exports = returnRouter;

function getAllStudents(req, res) {
	res.status(200).json({
		users:[
			{name: 'Thompson'}
		]
	});
}

function getStudent(req, res) {
	var id = req.params.studentId;
	var currentUser = req.session.user;
	var imgUrl = gravatar.url(currentUser.email, {s: '200', r: 'pg', d: 'retro'});
	res.render('student/index',{
			pageTitle: "School Management System",
			action: "records",
			isAuthenticated: true,
			user: currentUser,
			gravatar: imgUrl
		});
}

function getStudentAttendance(req, res) {
	var id = req.params.studentId;
	res.status(200).send("Hello "+id+". Attendance!");
}

function getStudentClassWork(req, res) {
	var id = req.params.studentId;
	res.status(200).send("Hello "+id+". Class work!");
}

function getStudentTimeTable(req, res) {
	var id = req.params.studentId;
	res.status(200).send("Hello "+id+". Time Table!");
}

function noStudent(req, res, next) {
	if (roleChecker.isStudent(req.user)) {
		res.redirect('/home/noPermission');
	} else {
		next();
	}
}