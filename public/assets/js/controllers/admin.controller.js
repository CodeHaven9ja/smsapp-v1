angular.module('app')
	.controller('AdminCtrl', ['$scope','StudentService','toaster', 
		function($scope, StudentService,toaster){

		var admCrtl = this;

		admCrtl.loaded = false;
		admCrtl.students = [];
		admCrtl.student = {};
		admCrtl._parent = {};
		admCrtl.currentActive;
		admCrtl.steps = [
			{
        templateUrl: 'admin/student-enroll-steps/activate.html',
        title: 'Activate Account',
        controller: 'stepCtrl'
    	},
    	{
        templateUrl: 'admin/student-enroll-steps/link.html',
        title: 'Link Parent'
    	}
		];

		admCrtl.onStudentClick = function(i){
			admCrtl.parent = {};
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
					toaster.pop({
						type:'error', 
						title:"Done!", 
						body: admCrtl.student.firstName+" deactivated",
						timeout: 0,
						showCloseButton: true
					});
				}
			}).catch((error) =>{
				toaster.pop({
					type:'error', 
					title:"Oops!", 
					body: "An error occurred.",
					timeout: 0,
					showCloseButton: true
				});
				admCrtl.student.isActive = isActive;
				if (!isActive) {
					el.removeClass('check');
				} else {
					el.addClass('check');
				}
			});
		}
		admCrtl.getParent = function(id) {
			console.log(admCrtl._parent);
			StudentService.GetParent(id).then((parent) =>{
				admCrtl._parent = {};
				admCrtl.parent = parent;
			}).catch((error) =>{
				console.log(error);
			});
		}

		admCrtl.linkParent = function(){
			StudentService.LinkParent(admCrtl.student.objectId, 
				admCrtl.parent.objectId).then((user) =>{
					admCrtl.student = user;
			});
		}
		admCrtl.clearParent = function(){
			admCrtl.parent = {};
		}

	}]);