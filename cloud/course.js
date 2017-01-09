var _ = require("underscore");

Parse.Cloud.beforeSave("Course", (req, res) =>{
	var course = req.object;
	var token = req.user.getSessionToken();
	var parentACLKey = "parentOf_"+course.get("student").id;
	if (!course.existed()) {
		var courseACL = new Parse.ACL();
		courseACL.setReadAccess("teacher", true);
		courseACL.setWriteAccess("teacher", true);
		courseACL.setReadAccess(course.get("student"), true);
		courseACL.setReadAccess(parentACLKey, true);
		course.setACL(courseACL);
	}
	course.save(null, {sessionToken: token}).then((r) =>{
		return res.success(r);
	}).catch((err) =>{
		return res.error(err);
	});
});