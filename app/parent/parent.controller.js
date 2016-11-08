angular.module('app')
	.controller('ParentListCtrl', ['ParentService', 'UserService',listChildren]);

function listChildren(ParentService, UserService) {
	var pListCrtl = this;
	pListCrtl.children = [];

	UserService.GetCurrent().then(function(user){
		return ParentService.GetChildren(user);
	}).then(function(students){
		for (var i = 0; i < students.result.length; i++) {
			pListCrtl.children.push(students.result[i].user);
		}
		console.log(pListCrtl.children);
	});
}