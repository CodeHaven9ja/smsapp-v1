var express = require('express');
var gravatar = require('gravatar');
var router = express.Router();

var returnRouter = function(parse){
	var Parse = parse;
	var parseLogin = require('../modules/parse-login.js')(Parse);
	var parseRegister = require('../modules/parse-register.js')(Parse);
	var parseAuthCheck = require('../modules/parse-check.js')(Parse);

	router.get('/', (req, res) => {
		var currentUser = req.session.user;
		if (currentUser){
			var imgUrl = gravatar.url(currentUser.email, {s: '200', r: 'pg', d: 'retro'});
			res.render('dash/index',{
				pageTitle: "School management system | Home",
				isAuthenticated: true,
				user: currentUser,
				gravatar: imgUrl
			});
		} else {
			res.redirect('/home/login')
		}
	});
	return router;
}
module.exports = returnRouter;