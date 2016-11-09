angular.module('app')
	.controller('AdminCtrl', ['$scope','StudentService','toaster', '$filter', 'PasswordGenerator', 
		function($scope, StudentService,toaster,$filter,PasswordGenerator){

		var tECrtl = this;

		tECrtl.loaded = false;
		tECrtl.students = [];
		tECrtl.newStudent;
		tECrtl.student = {};
		tECrtl._parent = {};
		tECrtl.currentActive;
		tECrtl.steps = [
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

		$scope.$watch('tECrtl.newStudent.firstName', function(){
			if (!tECrtl.newStudent.lastName) {
				tECrtl.newStudent.lastName = "";
			}
			var user = tECrtl.newStudent.firstName +"."+tECrtl.newStudent.lastName;
			tECrtl.newStudent.username = ""; 
			tECrtl.newStudent.username = user.toLowerCase(); 
		});

		$scope.$watch('tECrtl.newStudent.lastName', function(){
			var user = tECrtl.newStudent.firstName +"."+tECrtl.newStudent.lastName;
			tECrtl.newStudent.username = ""; 
			tECrtl.newStudent.username = user.toLowerCase(); 
		});


		tECrtl.onStudentClick = function(s){
			tECrtl.parent = {};
			tECrtl.loaded = true;
			tECrtl.student = s;
			tECrtl.currentActive = tECrtl.student.isActive;

		};

		StudentService.GetAllStudents().then((students) => {
			// console.log(students.results);
			tECrtl.students = students.results;
		});
		
		tECrtl.toggleActivate = function(id, isActive) {
			var el = angular.element('#'+id);
			tECrtl.student.isActive = !isActive;
			if (isActive) {
				el.removeClass('check');
			} else {
				el.addClass('check');
			}
			StudentService.ToggleActivate(tECrtl.student).then((user) =>{
				var status;
				if (tECrtl.student.isActive) {
					toaster.pop('success', "Done!", tECrtl.student.firstName+" activated");
				} else {
					toaster.pop({
						type:'error', 
						title:"Done!", 
						body: tECrtl.student.firstName+" deactivated",
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
				tECrtl.student.isActive = isActive;
				if (!isActive) {
					el.removeClass('check');
				} else {
					el.addClass('check');
				}
			});
		}
		tECrtl.getParent = function(id) {
			StudentService.GetParent(id).then((parent) =>{
				if (parent.role != 'parent') {
					throw new UserException('Not a Parent. Please ensure that the ID is correct.');
				}
				tECrtl._parent = {};
				tECrtl.parent = parent;
			}).catch((error) =>{
				toaster.pop({
					type:'error', 
					title:"Error", 
					body: error.message,
					timeout: 0,
					showCloseButton: true
				});
			});
		}

		tECrtl.linkParent = function(){
			StudentService.LinkParent(tECrtl.student.objectId, 
				tECrtl.parent.objectId).then((user) =>{
					tECrtl.student = user;
					for (var i = 0; i < tECrtl.students.length; i++) {
						if (tECrtl.students[i].objectId === tECrtl.student.objectId) {
							tECrtl.students[i] = tECrtl.student;
							toaster.pop('success', "Done!", tECrtl.students[i].firstName+" Linked!");
						}
					}
			}).catch((error) =>{
				toaster.pop({
					type:'error', 
					title:"Error", 
					body: error.message,
					timeout: 0,
					showCloseButton: true
				});
			});
		}
		tECrtl.removeLink = function(s){
			StudentService.RemoveLink(s.objectId).then((student) =>{
				tECrtl.student = $filter('filter')(tECrtl.students, function(d){
					return d.objectId === s.objectId;
				})[0];
				delete tECrtl.student.profile;
				toaster.pop('success', "Done!", s.firstName+" unlinked!");
			}).catch((error) =>{
				toaster.pop({
					type:'error', 
					title:"Error", 
					body: error.message,
					timeout: 0,
					showCloseButton: true
				});
			});
		}

		tECrtl.clearParent = function(){
			tECrtl.parent = {};
		}

		$scope.$on('new-user', function(){
			if (!tECrtl.newStudent 
 				|| !tECrtl.newStudent.username 
 				|| !tECrtl.newStudent.email 
 				|| !tECrtl.newStudent.firstName
 				|| !tECrtl.newStudent.lastName) {
 				return;
 			}

 			tECrtl.newStudent.password = PasswordGenerator.generatePassword(10);
 			tECrtl.newStudent.passClear = tECrtl.newStudent.password;
 			tECrtl.newStudent.deleteClear = true;

 			StudentService.NewStudent(tECrtl.newStudent).then(function(u){
 				return StudentService.GetStudent(u.objectId);
 			}).then(function(stu){
 				toaster.pop('success', "Done!", stu.firstName+" added!");
 				tECrtl.students.unshift(stu);
 			}).catch(function(err){
 				toaster.pop('error', "Oops!", "Student not added!");
 			});

 		});

	}])