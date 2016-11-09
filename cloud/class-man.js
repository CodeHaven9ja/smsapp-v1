Parse.Cloud.afterSave('ClassRoom', (req, res) => {
	// Get current user

	var user = req.user;

	// Classroom

	var classRoom = req.object;

	// Get School

	var schoolQ = new Parse.Query('School');
	schoolQ.first({sessionToken : user.getSessionToken()}).then((s) =>{
		var relation = s.relation('classRoom');
		relation.add(classRoom);

		return s.save(null, {sessionToken : user.getSessionToken()});
	}).then((s) =>{
		return res.success({school: s, class: classRoom});
	}).catch((error) =>{
    res.error(error);
  });
});

Parse.Cloud.define('getClasses', (req, res) => {
	var user = req.user;

	var schoolQ = new Parse.Query('School');
	schoolQ.first({sessionToken : user.getSessionToken()}).then((s) =>{
		var relation = s.relation("classRoom");
		var query = relation.query();

		return query.find({sessionToken : user.getSessionToken()});
	}).then((c)=>{
		return res.success(c);
	}).catch((error) =>{
    res.error(error);
  });
});

Parse.Cloud.define('addToClass', (req, res) => {
	var cid = req.params.cid,
			sid = req.params.sid,
			token = req.user.getSessionToken();

	var student, clazz;

	var sQ = new Parse.Query(Parse.User);
	sQ.equalTo('objectId', sid);

	sQ.first({sessionToken: token}).then((s) =>{
		student = s;
		var cQ = new Parse.Query('ClassRoom');
		cQ.equalTo('objectId', cid);
		return cQ.first({sessionToken: token});
	}).then((c) =>{
		var relation = c.relation('students');
		relation.add(student);
		return c.save(null, {sessionToken: token});
	}).then((c) =>{
		return res.success({class:c, student:student});
	}).catch((error) =>{
    res.error(error);
  });
});

Parse.Cloud.define('updateStudentPCID', (req, res) => {
	var pcid = req.params.pcid,
			sid = req.params.sid;
	var sQ = new Parse.Query(Parse.User);
	sQ.equalTo('objectId', sid);
	var promises = [];
	sQ.first().then((s) =>{
		if (s.has('pcid')){
			var c = new Parse.Query('ClassRoom');
			c.equalTo('objectId', s.get('pcid'));
			var dd = c.first().then((c) =>{
				var r = c.relation('students');
				r.remove(s);
				return c.save(null, { useMasterKey: true });
			}).then(() =>{
				return {removed: true};
			}).catch((error) =>{
				return {removed: false};
			});
			promises.push(dd); 
		}
		s.set('pcid', pcid);
		promises.push(s.save(null, { useMasterKey: true }));
		return Parse.Promise.when(promises);
	}).then((stat) =>{
		return res.success({done: true});
	}).catch((error) =>{
  	return res.error(error);
	});
});