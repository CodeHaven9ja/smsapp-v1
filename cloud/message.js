var _ = require("underscore");

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

Parse.Cloud.define("loopSend", (req, res) =>{
	var Message = Parse.Object.extend("Message");
	var currentUser = req.user;
	var obj = req.params.message;
	var toUsers = obj.users;
	var cMessage;
	var cM = new Message();
	cM.set("text", obj.message.text);

	return cM.save(null, {sessionToken: currentUser.getSessionToken()}).then((mess) =>{
		var count = toUsers.length;
		var promises = [];
		var Mail = Parse.Object.extend("Mail");
		
		_.each(toUsers, (user) =>{
			var mail = new Mail();

			var u = {
				"__type": "Pointer",
  			"className": "_User",
  			"objectId": user
			};


      console.log(u);

			mail.set("to", u);
			mail.set("from", currentUser);
			mail.set("isRead", false);
			mail.set("message", mess);
			mail.set("subject", obj.message.subject);

			promises.push(mail.save(null, {sessionToken: currentUser.getSessionToken()}));
		});
		console.log(promises);
		return Parse.Promise.when(promises);
	}).then(() =>{
		return res.success();
	}).catch((err) =>{
		return res.error(err);
	});

});

Parse.Cloud.beforeSave("Mail", (req, res) =>{
	var mail = req.object;

	var from = mail.get("from");
	var to = mail.get("to");

	var roleACL = new Parse.ACL();

	roleACL.setPublicReadAccess(false);
	roleACL.setRoleReadAccess("admin", true);
	roleACL.setRoleWriteAccess("admin", true);
	roleACL.setWriteAccess(from, true);
	roleACL.setWriteAccess(to, true);
	roleACL.setReadAccess(from, true);
	roleACL.setReadAccess(to, true);

	mail.setACL(roleACL);

	res.success();

});