angular.module('app')
	.controller('ParentListCtrl', ['students','ParentService', 'UserService', 'StudentService',listChildren]);

function listChildren(students,ParentService, UserService, StudentService) {
	var pListCrtl = this;

	pListCrtl.parent;

	pListCrtl.children = students;

	// console.log(students);

	pListCrtl.getClass = function(s, p) {
		console.log(s, p);
		var c = {};
		if (!s) {
			return c;
		}
		return StudentService.GetStudentClass(s.objectId, p).then(function(clazz){
				if (clazz.result) {
					c = clazz.result;
				} else {
					c = {
						commonName: 'Not assigned to a class.'
					}
				}
			return c;
		}).catch(function(err){
			console.log(err);
			c = {
				commonName: 'Not assigned to a class.'
			}
			return c;
		});
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