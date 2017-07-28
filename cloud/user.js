/*jshint esversion: 6 */
var _ = require("underscore");

var Profile = Parse.Object.extend("Profile");

Parse.Cloud.job('sanitizeUser', (req, stat) => {
	var promises = [];

	var query = new Parse.Query(Parse.User);

	query.doesNotExist("p_username");
	query.doesNotExist("p_email");
	query.doesNotExist("p_firstName");
	query.doesNotExist("p_lastName");

	return query.find().then((users) => {
		_.each(users, (user)=> {
			user.set("p_username", user.get("username").toLowerCase());
			user.set("p_email", user.get("email").toLowerCase());
			user.set("p_firstName", user.get("firstName").toLowerCase());
			user.set("p_lastName", user.get("lastName").toLowerCase());
			promises.push(user.save(null, {useMasterKey:true}));
		});
		return Parse.Promise.when(promises);
	}).then(() =>{
		return stat.success("Done sanitizing.");
	}).catch((err) => {
		return stat.error(err);
	});

});

Parse.Cloud.job('profilize', (req, stat) => {
	var promises = [];

	var query = new Parse.Query(Parse.User);

	query.doesNotExist("profile");

	return query.find().then((users) =>{
		_.each(users, (user) => {
			let profile = new Profile();
			profile.set("user", user);

			user.set("profile", profile);

			promises.push(user.save(null, {useMasterKey:true}));
		});
		return Parse.Promise.when(promises);
	}).then(() =>{
		return stat.success("Done sanitizing.");
	}).catch((err) => {
		return stat.error(err);
	});
});