var express = require('express');
var app = express();

var login = (parse) => {
	return (req, res, next) => {
		var isLoggedIn = false; 
		var loginError;
		var currentUser = parse.User.current();
		if (currentUser) {
			parse.User.logOut();
		}
		var username = req.body.username;
		var password = req.body.password;
		parse.User.logIn(username, password).then((user)=>{
			req.user = user;
			req.isLoggedIn = true;
			res.redirect('/');
		}).catch((error) =>{
			loginError = error;
			console.log("Here "+JSON.stringify(loginError));
			res.render('home/login', {error:loginError});
		});
	}
}

module.exports = login;