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
		var relation = r.relation("subjects");
		var relQ = relation.query();
		relQ.include("subject");
		return relQ.find({sessionToken: currentUser.getSessionToken()});
	}).then((subjects) =>{
		return res.success(subjects);
	}).catch((err) =>{
		return res.error(err);
	});
});

Parse.Cloud.define('setSubject', (req, res) =>{
	var currentUser = req.user;
	var data = req.params.data;
	var student, school, report, term;
	var stuQ = new Parse.Query(Parse.User);
	stuQ.equalTo("objectId", data.studentId);

	return stuQ.first({sessionToken: currentUser.getSessionToken()}).then((s) =>{
		student = s;
		school = s.get("school");
		var tx = new Parse.Query("Term");
		tx.equalTo("isCurrentTerm", true);
		tx.equalTo("school", school);

		return tx.first({sessionToken: currentUser.getSessionToken()});
	}).then((t) => {
		term = t;
		var report = new Parse.Query("Report");
		report.equalTo("student", student);
		report.equalTo("term", term);
		return report.first({sessionToken: currentUser.getSessionToken()});
	}).then((r) =>{
		report = r;
		var relation = report.relation("subjects");
		var relQ = relation.query();
		var Topic = Parse.Object.extend("Topic");
		var topic = new Topic();
		topic.id = data.topicId;
		relQ.equalTo("subject", topic);
		return relQ.first({sessionToken: currentUser.getSessionToken()});
	}).then((s) =>{
		if (!s) {

			var Topic = Parse.Object.extend("Topic");
			var topic = new Topic();
			topic.id = data.topicId;
			var Subject = Parse.Object.extend("Subject");
			var ss = new Subject();
			ss.set("subject", topic);
			ss.set("score", data.score);
			ss.set("caScore", data.caScore);
			ss.set("examScore", data.examScore);
			if (data.score > 40) {
				ss.set("withExam", true);
			}
			return ss.save(null, {sessionToken: currentUser.getSessionToken()}).then((sx)=>{
				var relation = report.relation("subjects");
				relation.add(sx);
				return report.save(null, {sessionToken: currentUser.getSessionToken()});
			});

		} else {

			s.set("score", data.score);
			ss.set("caScore", data.caScore);
			ss.set("examScore", data.examScore);
			if (data.score > 40) {
				s.set("withExam", true);
			}
			return s.save(null, {sessionToken: currentUser.getSessionToken()});

		}
	}).then((s) =>{
		return res.success(s);
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
	}).catch((err) => {
		status.error('Users sanitization failed.');
	});
});

Parse.Cloud.beforeSave("Report", (req, res) => {
	let report = req.object;

	if (report.get("caScore") > 40) {
		res.error("CA test score cannot be greater than 40");
	}

	if (report.get("examScore") > 60) {
		res.error("Exam score cannot be greater than 60");
	}

	res.success();
});
