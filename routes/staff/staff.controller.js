/*jshint esversion: 6 */
var express = require('express');
var gravatar = require('gravatar');
var router = express.Router();
var roleChecker = require('../../modules/role-check.js');
var staffService = require('../../services/staff.service.js');
var studentService = require('../../services/student.service.js');
var userService = require('../../services/user.service.js');
var parentService = require('../../services/parent.service.js');

var returnRouter = function(parse){
	var Parse = parse;
	router.get('/', getStaffMembers);
	router.get('/:staffId', getStaffMember);
	router.post('/', newStaffMember);
	router.post('/position', cOrUposition);
	router.put('/:staffId', editStaffMember);
	router.delete('/:staffId', removeStaffMember);

	// Teacher Specific

	router.get('/:staffId/class', getStaffClass);
	router.post('/:staffId/:classId', assignTeacherToClass);

	return router;
}

module.exports = returnRouter;

function getStaffMembers(req, res) {
	var _token = req.session.user.sessionToken;
	staff = [];
	staffService.getStaffMembers(_token).then((s) =>{
		var sss = JSON.parse(s);
		if (!sss.result || sss.result.length === 0) {
			return res.status(404).send({errorCode:404, message: 'Staff members not found'});	
		} 
		staff = sss.result;
		// console.log(staff.length);
		return res.status(200).send(staff);

	}).catch((err) =>{
		return res.status(500).send(err);
	});
}

function getStaffMember(req, res) {
	return res.status(200).send({done:true});
}

function newStaffMember(req, res) {
	var _token = req.session.user.sessionToken;
	var staff = req.body;
	staff.password = staff.firstName+"."+staff.lastName;
	staff.role = "teacher";

	staffService.newStaffMember(_token, staff).then((s) =>{
		return staffService.getStaffMember(_token, s.objectId);
	}).then((x) =>{
		console.log("user", x);
		return res.status(200).send(x);
	}).catch((err) =>{
		console.log("err", err);
		return res.status(500).send(err);
	});
}

function editStaffMember(req, res) {
	var _token = req.session.user.sessionToken;
	var staff = req.body;
	staffService.activateStaff(_token, staff).then((s) =>{
		console.log(s);
		if (s.code === 206) {
			return res.status(403).send({done:false});
		}
		return res.status(200).send({done:true});
	}).catch((err) => {
		console.log(err);
		return res.status(500).send(err);
	});
}

function cOrUposition(req, res) {
	var _token = req.session.user.sessionToken;
	var staff = req.body;
	// TODO: Fix status code bug
	staffService.cOrUposition(_token, staff).then((staff) =>{
		return res.status(200).send(staff);
	}).catch((err) => {
		return res.status(500).send(err);
	});
}

function removeStaffMember(req, res) {
	return res.status(200).send({done:true});
}

function getStaffClass(req, res) {
	return res.status(200).send({done:true});
}

function assignTeacherToClass(req, res) {
	return res.status(200).send({done:true});
}