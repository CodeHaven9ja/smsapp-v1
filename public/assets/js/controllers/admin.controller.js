angular.module('app')
	.controller('AdminCtrl', ['$scope','StudentService','toaster', 
		function($scope, StudentService,toaster){

		var admCrtl = this;

		admCrtl.loaded = false;
		admCrtl.students = [];
		admCrtl.student = {};
		admCrtl.parent = {};
		admCrtl.currentActive;

		admCrtl.onStudentClick = function(i){
			admCrtl.loaded = true;
			admCrtl.student = admCrtl.students[i];
			admCrtl.currentActive = admCrtl.student.isActive;

		};

		StudentService.GetAllStudents().then((students) => {
			console.log(students.results);
			admCrtl.students = students.results;
		});
		
		admCrtl.toggleActivate = function(id, isActive) {
			var el = angular.element('#'+id);
			admCrtl.student.isActive = !isActive;
			if (isActive) {
				el.removeClass('check');
			} else {
				el.addClass('check');
			}
			StudentService.ToggleActivate(admCrtl.student).then((user) =>{
				var status;
				if (admCrtl.student.isActive) {
					toaster.pop('success', "Done!", admCrtl.student.firstName+" activated");
				} else {
					toaster.pop('error', "Done!", admCrtl.student.firstName+" deactivated");
				}
			}).catch((error) =>{
				toaster.pop('error', "Oops!", "An error occurred.");
				admCrtl.student.isActive = isActive;
				if (!isActive) {
					el.removeClass('check');
				} else {
					el.addClass('check');
				}
			});
		}
		admCrtl.getParent = function(id) {
			StudentService.GetParent(id).then((parent) =>{
				admCrtl.parent = parent.results[0];
			}).catch((error) =>{
				console.log(error);
			});
		}
		// $scope.$watch('admCrtl.student.isActive', function(newValue, oldValue){
		// 	var student = admCrtl.student;
		// 	if (admCrtl.loaded && admCrtl.shouldUpdate) {
		// 		console.log("Update",newValue);
		// 		StudentService.ToggleActivate(student).then((user) =>{
		// 			admCrtl.shouldUpdate = true;
		// 			console.log(user);
		// 		}).catch((error) =>{
		// 			admCrtl.student.isActive = admCrtl.currentActive;
		// 			admCrtl.shouldUpdate = true;
		// 			console.log(error);
		// 		})
		// 	}
		// });
	}]);