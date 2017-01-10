Parse.Cloud.define('getStudentClass', (req, res) =>{
	var token = req.user.getSessionToken();
	var sid = req.params.sid;
	console.log(token);
	var cQ = new Parse.Query("Classroom");

	cQ.containsAll('students', [sid]);

	cQ.first({sessionToken : token}).then((c) =>{
		return res.success(c);
	}).catch((err) =>{
		return res.error(err);
	});
})

// Parse.Cloud.job("CreateInitialReportsPerTerm", (req, status) =>{

// });