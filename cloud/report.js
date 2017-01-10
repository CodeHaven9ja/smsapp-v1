var _ = require("underscore");

// Parse.Cloud.afterSave("Report", (req, res) =>{
// 	var report = req.object;
// 	var student = report.get("student");
// 	var parentACLKey = "parentOf_"+student.get("objectId");
// 	if (!report.existed()) {
// 		var reportACL = new Parse.ACL();
// 		reportACL.setReadAccess("teacher", true);
// 		reportACL.setWriteAccess("teacher", true);
// 		reportACL.setReadAccess(student, true);
// 		reportACL.setReadAccess(parentACLKey, true);
// 		report.setACL(reportACL);
// 	}
// 	report.save(null, {useMasterKey: true}).then((r) =>{
// 		return res.success(r);
// 	}).catch((err) =>{
// 		console.log(err);
// 		return res.error(err);
// 	});
// });

Parse.Cloud.job("CreateInitialReportsPerTerm", (req, status) =>{
	var usersQuery = new Parse.Query(Parse.User);
	var user;
	usersQuery.equalTo("role", "user");
	usersQuery.equalTo("isActive", true);
	usersQuery.find({useMasterKey: true}).then((usrs) =>{
	var Report = Parse.Object.extend("Report");
	var Term = Parse.Object.extend("Term");
	
		_.each(usrs, (u) =>{
			user = u;
			console.log("Creating report for "+u.get("username"));
			var term = new Parse.Query("Term");
			term.equalTo("school", u.get("school"));
			term.equalTo("isCurrentTerm", true);
			term.first({useMasterKey: true}).then((t) =>{
				var trm = t;
				if (!t) {
					trm = new Term();
					trm.set("isCurrentTerm", true);
					trm.set("school", u.get("school"));
				}
				return trm.save();
			}).then((trm) =>{
				var report = new Report();
				var reportACL = new Parse.ACL();
				var parentACLKey = "parentOf_"+u.id;
				reportACL.setRoleReadAccess("teacher", true);
				reportACL.setRoleWriteAccess("teacher", true);
				reportACL.setRoleReadAccess("admin", true);
				reportACL.setRoleWriteAccess("admin", true);
				reportACL.setReadAccess(u, true);
				reportACL.setReadAccess(parentACLKey, true);
				report.set("student", u);
				report.set("term", trm);
				report.setACL(reportACL);
				return report.save(null, {useMasterKey: true});
			});

		});

		status.success('Users sanitized.');
	});
});
