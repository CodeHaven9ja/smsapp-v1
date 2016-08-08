var express = require('express');
var app = express();

var register = (parse) => {
	return (req, res, next) => {
		var u = req.body;
		var user = new parse.User();
		var currentUser = parse.User.current();
		if (currentUser) {
			parse.User.logOut();
		}
		user.set("username", u.username);
		user.set("password", u.password);
		user.set("email", u.email);
		user.set("firstName", u.firstName);
		user.set("lastName", u.lastName);
		user.set("otherName", u.otherName);
		user.set("address", u.address);
		user.set("city", u.city);
		user.set("sex", u.sex);
		user.set("role", "user");

		user.signUp().then((user) =>{
			req.session.user = user;
			req.isLoggedIn = true;
			res.redirect('/');
		}).catch((error) =>{
			registerError = error;
			console.log("Here "+JSON.stringify(registerError));
			res.render('home/register', {error:registerError});
		})
	}
}

module.exports = register;