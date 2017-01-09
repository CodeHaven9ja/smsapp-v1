Parse.Cloud.beforeSave("Term", (req, res) =>{
	var term = req.object;
	var user = req.user;
	var adminRoleQuery = new Parse.Query(Parse.Role);
	var termQuery = new Parse.Query("Term");
	termQuery.equalTo('isCurrentTerm', true);
	adminRoleQuery.equalTo('name', 'teacher');
	// adminRoleQuery.equalTo('users', req.user);

	return adminRoleQuery.first({sessionToken: user.getSessionToken()}).then((adminRole) =>{
		if (!adminRole) {
	    throw new Error('Not an admin');
	  }
	  return termQuery.first({sessionToken: user.getSessionToken()});
	}).then((t) => {
		if (term == t) {
			return res.error("This term already exists.");
		}
		t.set('isCurrentTerm', false);
		return t.save(null, {sessionToken: user.getSessionToken()});
	}).then((t) =>{
		term.set('isCurrentTerm', true);
		return term.save(null, {sessionToken: user.getSessionToken()});
	}).then((t) =>{
		return res.success(t);
	}).catch((err) =>{
		return res.error(err);
	});
});