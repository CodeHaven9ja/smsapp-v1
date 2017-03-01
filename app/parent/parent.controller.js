angular.module('app')
	.controller('ParentListCtrl', ['students', 'parent', 'ParentService', 'UserService', 'StudentService', '$q',listChildren]);

function listChildren(students, parent, ParentService, UserService, StudentService, $q) {
	var pListCrtl = this;

	pListCrtl.parent = parent;

	pListCrtl.children = students;

	// console.log(students);

	var r = [];

	for (var i = 0; i < pListCrtl.children.length; i++) {
		var child = pListCrtl.children[i];
		r.push(StudentService.GetStudentClass(child.objectId, pListCrtl.parent));
	}

	$q.all(r).then(function(res){
		for (var i = 0; i < res.length; i++) {
			pListCrtl.children[i].class = res[i];
		}
		return pListCrtl.children;
	}).then(function(c) {
			console.log(c);
	});

	pListCrtl.getClass = function(s, p) {
		// console.log(s, p);
		var c = {};
		if (!s) {
			return c;
		}
		// return StudentService.GetStudentClass(s.objectId, p).then(function(clazz){
		// 		if (clazz.result) {
		// 			c = clazz.result;
		// 		} else {
		// 			c = {
		// 				commonName: 'Not assigned to a class.'
		// 			}
		// 		}
		// 	return c;
		// }).catch(function(err){
		// 	console.log(err);
		// 	c = {
		// 		commonName: 'Not assigned to a class.'
		// 	}
		// 	return c;
		// });
	}

	// UserService.GetCurrent().then(function(user){
	// 	pListCrtl.parent = user;
	// 	return ParentService.GetChildren(user);
	// }).then(function(students){
	// 	for (var i = 0; i < students.results.length; i++) {
	// 		var student = students.results[i].user;
	// 		StudentService.GetStudentClass(students.results[i].user.objectId,
	
	// 				pListCrtl.children.push(student);
	// 		});
	// 	}
	// });
}