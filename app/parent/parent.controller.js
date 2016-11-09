angular.module('app')
	.controller('ParentListCtrl', ['ParentService', 'UserService', 'StudentService',listChildren]);

function listChildren(ParentService, UserService, StudentService) {
	var pListCrtl = this;

	pListCrtl.parent;

	pListCrtl.children = [];

	UserService.GetCurrent().then(function(user){
		pListCrtl.parent = user;
		return ParentService.GetChildren(user);
	}).then(function(students){
		for (var i = 0; i < students.result.length; i++) {
			var student = students.result[i].user;
			StudentService.GetStudentClass(students.result[i].user.objectId,
	 			pListCrtl.parent).then(function(clazz){
					if (clazz.result) {
						student.class = clazz.result;
					} else {
						student.class = {
							commonName: 'Not assigned to a class.'
						}
					}
					pListCrtl.children.push(student);
			});
		}
	});
}