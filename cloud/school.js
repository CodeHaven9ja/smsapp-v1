var _ = require("underscore");

Parse.Cloud.afterSave("School", (req, res) =>{
	var school = req.object;

	if (!school.existed()) {
		var adminRole;
		var rQ = new Parse.Query(Parse.Role);
		rQ.equalTo("name", "admin");
		rQ.first({useMasterKey:true}).then((role) =>{
			adminRole = role;
			var roleACL = new Parse.ACL();
			roleACL.setPublicReadAccess(false);
			roleACL.setRoleReadAccess("admin", true);
			roleACL.setRoleWriteAccess("admin", true);
			roleACL.setRoleReadAccess("teacher", true);
			roleACL.setRoleWriteAccess("teacher", true);
			var role = new Parse.Role("adminOf_"+school.id, roleACL);
			role.getRoles().add(adminRole);
			return role.save(null, {useMasterKey: true});
		}).then((role) =>{
			var schoolACL = new Parse.ACL();
			schoolACL.setRoleReadAccess(role.get("name"), true);
			schoolACL.setRoleWriteAccess(role.get("name"), true);
			schoolACL.setPublicReadAccess(false);
			school.setACL(schoolACL);
			return school.save(null, {useMasterKey:true});
		}).then((school) =>{
			console.log(school);
			res.success(school);
		}).catch((err) =>{
			console.log(err);
			res.error(error);
		});
	}
});

// Parse.Cloud.beforeDelete("School", (req, res) =>{
// 	var school = req.object;
// 	var user = req.user;

// 	var rQ = new Parse.Query(Parse.Role);
// 	rQ.equalTo("name", "memberOf_"+school.id);
// 	rq.first({sessionToken: user.getSessionToken()}).then((role) =>{
// 		return role.destroy({sessionToken: user.getSessionToken()});
// 	}).then((r) =>{
// 		return res.success();
// 	}).catch((err) =>{
// 		console.log(err);
// 		return res.error(err);
// 	});
// });

Parse.Cloud.define("addAdminToSchool", (req, res) =>{
	var schoolId = req.params.sid;
	var user = req.user;
	var newAdmin = req.params.newAdminId;
	var role;
	var schoolRQ = new Parse.Query(Parse.Role);
	schoolRQ.equalTo("name", "adminOf_"+schoolId);
	schoolRQ.first({sessionToken: user.getSessionToken()}).then((r) =>{
		role = r;
		var uQ = new Parse.Query(Parse.User);
		uQ.equalTo("objectId", newAdmin);
		return uQ.first();
	}).then((u) =>{
		role.getUsers().add(u);
		return role.save(null, {sessionToken:user.getSessionToken()});
	}).then((r) =>{
		return res.success("Admin added!");
	}).catch((err) =>{
		console.log(err);
		return res.error(err);
	});
});

Parse.Cloud.job("deleteUndefinedRole", (req, status) =>{
	var rQ = new Parse.Query(Parse.Role);
	rQ.equalTo("name", "memberOf_undefined");
	var count = 1;
	rQ.find({useMasterKey: true}).then((roles) =>{
		_.each(roles, (role) =>{
			console.log(role.get("name"));
			role.destroy({
				success: (r) =>{
					console.log("Destroyed "+ count);
					count++;
			}, 
				error: (err) =>{
					console.log(err);
			}},{useMasterKey: true});
		});
	});
});