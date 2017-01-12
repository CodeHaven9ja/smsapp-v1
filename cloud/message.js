Parse.Cloud.define("newMessage", (req, res) =>{
	var toId = req.params.toId;
	var text = req.params.text;
	var user = req.user;
	var Message = Parse.Object.extend("Message");
	var roleACL = new Parse.ACL();

	var uQ = new Parse.Query(Parse.User);
	uQ.equalTo("objectId", toId);

	uQ.first().then((toUser) =>{
		var message = new Message();
		message.set("text", text);

		roleACL.setPublicReadAccess(false);
		roleACL.setRoleReadAccess("admin", true);
		roleACL.setRoleWriteAccess("admin", true);
		roleACL.setWriteAccess(user, true);
		roleACL.setWriteAccess(toUser, true);
		roleACL.setReadAccess(user, true);
		roleACL.setReadAccess(toUser, true);

		message.setACL(roleACL);

		return message.save(null, {sessionToken: user.getSessionToken()});

	}).then((message) =>{
		res.success(message);
	}).catch((err) =>{
		res.error(err);
	});

});