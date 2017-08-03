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

			if (user.get("role") == "user") {
				profile.set("type", "student");
			} else if (user.get("role") == "parent") {
				profile.set("type", "parent");
			} else {
				profile.set("type", "staff");
			}

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

Parse.Cloud.define("removeAdmin", (req, res) =>{
	let user = req.params.user;

	console.log(user);

	let uQ = new Parse.Query(Parse.User);
	uQ.equalTo("objectId", user.objectId);

	return uQ.first().then((user) =>{
		user.unset("school");
		user.set("role", "none");
		return user.save(null, {useMasterKey:true});
	}).then((user) =>{
		return res.success(user);
	}).catch((err) =>{
		return res.error(err);
	});
});

Parse.Cloud.define("addAdmin", (req, res) =>{
	let admin  = req.params.user;
	let user   = req.user;
	let school = user.get("school");
	let role 	 = "adminOf"+school.id; 

	console.log(admin);

	let uQ = new Parse.Query(Parse.User);
	uQ.equalTo("objectId", admin.objectId);

	return uQ.first().then((user) =>{
		admin = user;
		admin.set("school", school);
		admin.set("role", "admin");
		return admin.save(null, {useMasterKey:true});
	}).then((user) =>{
		return res.success(admin);
	}).catch((err) =>{
		return res.error(err);
	});
});