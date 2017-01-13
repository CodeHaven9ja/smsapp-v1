var _ = require("underscore");

Parse.Cloud.define('getResult', (req, res) =>{
	var currentUser = req.user;
	var student = req.params.sid;
	var sQ = new Parse.Query(Parse.User);
	var rQ = new Parse.Query("Report");
	sQ.equalTo("objectId", student);

	sQ.first({sessionToken: currentUser.getSessionToken()}).then((user) =>{
		rQ.equalTo("student", user);
		rQ.include("subjects");
		return rQ.first({sessionToken: currentUser.getSessionToken()});
	}).then((r) =>{
		console.log(r);
		var relation = r.relation("subjects");
		return relation.query().find({sessionToken: currentUser.getSessionToken()});
	}).then((subjects) =>{
		return res.success(subjects);
	}).catch((err) =>{
		return res.error(err);
	});
});

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
