/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();

var returnRouter = function(parse){
	var Parse = parse;
	var parseLogin = require('../modules/parse-login.js')(Parse);
	var parseRegister = require('../modules/parse-register.js')(Parse);
	var parseAuthCheck = require('../modules/parse-check.js')(Parse);
	router.get('/',  (req,res) =>{
		var currentUser = req.session.user;
		if (req.path !== '/login' && !currentUser) {
			res.redirect('/home/login');
		} else {
			// res.render('index', {
			// 	page: "dash_index",
			// 	pageTitle: "Schoolpop", 
			// 	isAuthenticated: true,
			// 	user: req.user,
			// 	controller: "home",
			// 	action: "index"
			// });
			res.redirect('/dash');
		}
	});

	router.get('/login', (req, res) => {
		if (req.login.error) {
			console.log(JSON.stringify(req.login.error));
		}
		res.render('home/login',{
			pageTitle: "Schoolpop | Login",
			controller: "home",
			action: "login"
		});
	});

	router.get('/register', (req, res) =>{
		res.render('home/register', {
			pageTitle: "Schoolpop | Login",
			controller: "home",
			action: "register"
		});
	});

	router.get('/logout', (req,res) =>{
		delete req.session.user;
		res.redirect('/');
	});

	router.post('/login', (req, res) =>{
		parse.User.logIn(req.body.username, req.body.password).then((user) =>{
			req.session.user = user;
			req.session.token = user.sessionToken;
			res.redirect('/');
		}).catch((error)=>{
			loginError = error;
			res.render('home/login', {error:loginError});
		});
	});

	router.get('/noPermission', (req, res) =>{
		var user = req.session.user;
		delete req.session.user;
		res.render('home/noPermission', {
			page: "dash_index",
			pageTitle: "Schoolpop", 
			isAuthenticated: true,
			user: user,
		});
	});

	router.post('/register', parseRegister, (req, res) =>{
		res.redirect('/');
	});
	return router;
};
module.exports = returnRouter;
