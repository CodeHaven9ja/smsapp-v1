/*jshint esversion: 6 */
var express = require('express');
var gravatar = require('gravatar');
var router = express.Router();
var roleChecker = require('../../modules/role-check.js');
var studentService = require('../../services/staff.service.js');
var studentService = require('../../services/student.service.js');
var userService = require('../../services/user.service.js');
var parentService = require('../../services/parent.service.js');

var returnRouter = function(parse){
	var Parse = parse;
	router.get('/', getStaffMembers);
	router.get('/:staffId', getStaffMember);
	router.post('/', newStaffMember);
	router.put('/:staffId', editStaffMember);
	router.delete('/:staffId', removeStaffMember);

	// Teacher Specific

	router.get('/:staffId/class', getStaffClass);
	router.post('/staffId/:classId', assignTeacherToClass);

	return router;
}

module.exports = returnRouter;

function getStaffMembers(req, res) {
	return res.status(201).send({done:true});
}

function getStaffMember(req, res) {
	return res.status(201).send({done:true});
}

function newStaffMember(req, res) {
	return res.status(201).send({done:true});
}

function editStaffMember(req, res) {
	return res.status(201).send({done:true});
}

function removeStaffMember(req, res) {
	return res.status(201).send({done:true});
}

function getStaffClass(req, res) {
	return res.status(201).send({done:true});
}

function assignTeacherToClass(req, res) {
	return res.status(201).send({done:true});
}