/*jshint esversion: 6 */
Parse.Cloud.define('hello', (req, res) => {
  res.success('Hi');
});

Parse.Cloud.beforeSave(Parse.User, (req, res) =>{
	var user = req.object;
	console.log("User => " +user);
	res.success();
});

Parse.Cloud.afterSave(Parse.User, (req, res) => {
	var user = req.object;
    if (user.existed()) { return; }
    user.set("role", "user");
    user.set("isActive", false);
    return user.save();
});