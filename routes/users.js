var express = require('express');
var passport = require('passport');
var Parse = require('parse/node').Parse;
var router = express.Router();

var Profiles = Parse.Object.extend("Profiles");

router.get('/',function(req,res){
	var isAuth = req.isAuthenticated();

	if (isAuth) {
		var query = new Parse.Query(Profiles);
		query.find().then(function(results){
			var Profiles = [];
			for (var i = 0; i < results.length; i++){
				var object = results[i];
				if (object.get('sex')=== "M") {
					var sex = "Male";
				} else {
					var sex = "Female";
				};
				Profiles.push({
					objectId: object.id,
					firstName: object.get('firstName'),
					lastName: object.get('lastName'),
					sex: sex
				});
			}	
				return Profiles;
		}).then(function(s){
			// console.log(s.length);
			res.render('Profiles/index', {
				page: "student_index",
				pageTitle: "School management system | Profiles", 
				ProfilesList: s,
				user: req.user
			});	
		});
	} else {
		res.redirect('/login');
	};

});

router.post('/', function(req, res){


	var isAuth = req.isAuthenticated();

	if (isAuth) {
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var sex = req.body.sex;
		var postStudent = new Profiles();
		postStudent.set("firstName", firstName);
		postStudent.set("lastName", lastName);
		postStudent.set("sex", sex);
		

		postStudent.save(null, {}).then(function(postStudent){
			return postStudent;
		}).then(function(ps){
			var user = new Parse.User();
			user.set("username", firstName+lastName);
			user.set("password", firstName+lastName+"password");
			user.set("role", "Profiles");
			return user.signUp();
		}).then(function(user){
			res.redirect('/Profiles');
		}, function(err){
			console.log(err);
			res.send(err);
		});

	} else {
		res.redirect('/login');
	};

});

router.delete('/:id', function(req, res){
	var method = req.body._method;
	res.send(method);
});

router.get('/:id', function(req, res){
	var method = req.query.method;

	var isAuth = req.isAuthenticated();
	if (isAuth) {
		var query = new Parse.Query(Profiles);
		if (method === "delete") {
			query.get(req.params.id).then(function(s){
				return s;
			}).then(function(s){
				s.destroy();
			}).then(function(){
				res.redirect('/Profiles');
			});
		} else {
			console.log(req.params.id);
			query.get(req.params.id).then(function(student){
				return student;
			}).then(function(s){
				console.log(method);
				res.send(s.get("firstName"));
			});
		}
	} else {
		res.redirect('/login');
	};

});

router.post('/:id', function(req, res){

	var isAuth = req.isAuthenticated();
	if (isAuth) {
		var id = req.params.id;
		var method = req.body._method;

		var Profiles = [];
		var query = new Parse.Query(Profiles);

		if (method === "delete") {
			del(id).then(function(){
				res.redirect('/Profiles');
			});
		} else{
			query.get(id, {
				success: function(s){
					s.destroy({
						success: function(o){
							console.log(o);
							res.redirect('/Profiles');	
						},
						error: function(e){
							console.log(e);
						}
					});
				},
				error: function(error){
					console.log(error);
					res.redirect('/Profiles');
				}
			});
		};

	} else {
		res.redirect('/login');
	};

});

function del(id){
	var student = getStudent(id);
	console.log(student);
	student.then(function(s){
		return s.destroy();
	}).then(function(s){
		return s;
	});
}

function getStudent(id){
	var query = new Parse.Query(Profiles);
	console.log(query.get(id));
	query.get(id).then(function(s){
		return s;
	});
}
module.exports = router;