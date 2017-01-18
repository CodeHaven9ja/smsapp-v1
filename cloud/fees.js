// Parse.Cloud.beforeSave("Fees", (req, res) =>{
// 	// var user = 
// });

Parse.Cloud.define('getFees', (req, res) =>{
	var user = req.user;
	var sid = req.params.sid;
	var student, school, term, fee;

	var sQ = new Parse.Query(Parse.User);
	sQ.equalTo("objectId", sid);
	return sQ.first({sessionToken: user.getSessionToken()}).then((s) =>{
		student = s;
		school = student.get("school");
		var termQ = new Parse.Query("Term");
		termQ.equalTo("isCurrentTerm", true);
		termQ.equalTo("school", school);
		return termQ.first({sessionToken: user.getSessionToken()});
	}).then((t) =>{
		term = t;
		var fee = new Parse.Query("Fees");
		fee.equalTo("term", term);
		fee.equalTo("student", student);

		return fee.first({sessionToken: user.getSessionToken()});
	}).then((fee) =>{
		if (!fee) {
			var Fee = Parse.Object.extend("Fees");
			var roleACL = new Parse.ACL();
			var fee = new Fee();

			roleACL.setPublicReadAccess(false);
			roleACL.setRoleReadAccess("admin", true);
			roleACL.setRoleWriteAccess("admin", true);
			roleACL.setRoleReadAccess("teacher", true);
			roleACL.setRoleReadAccess("parentOf_"+student.id, true);
			roleACL.setReadAccess(student, true);

			fee.setACL(roleACL);
			fee.set("amount_due", 0);
			fee.set("amount_paid", 0);
			fee.set("percent_paid", 0);
			fee.set("term", term);
			fee.set("student", student);
			fee.set("paid", false);
			return fee.save(null, {sessionToken: user.getSessionToken()});
		} else {
			return fee;		
		}
	}).then((fee) =>{
		return res.success(fee);	
	}).catch((err) =>{
		return res.error(err);
	});

})