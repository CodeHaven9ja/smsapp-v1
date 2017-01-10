var _ = require("underscore");

Parse.Cloud.job("CloudJobTesting", function(request, status) {
    console.log('Running....');
    status.success('Job completed successfully');   
});

Parse.Cloud.job("SanitizeUsers", (req, status) =>{
	var q = new Parse.Query(Parse.User);
	q.find({useMasterKey: true}).then((users) =>{
		_.each(users, (user) =>{
			console.log(user.get("username"));
			if (!user.has("emailVerified")) {
				user.set("emailVerified", false);
			}
			if (!user.has("authData")) {
				user.set("authData", null);
			}
			if (!user.has("deleteClear")) {
				user.set("deleteClear", false);
			}
			if (!user.has("profile")) {
				user.set("profile", null);
			}
			user.save(null, {useMasterKey: true});
		});
		status.success('Users sanitized.');
	}).catch((err) =>{
		status.error(err);
	});
});