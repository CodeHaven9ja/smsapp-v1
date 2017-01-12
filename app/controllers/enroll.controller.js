angular.module('app')
	.controller('AdminCtrl', ['$scope','StudentService','toaster', '$filter', 'PasswordGenerator', 'StaffService', 
		function($scope, StudentService,toaster,$filter,PasswordGenerator, StaffService){

		var admCrtl = this;

		admCrtl.loaded = false;
		admCrtl.students = [];
		admCrtl.newStudent;
		admCrtl.student = {};
		admCrtl._parent = {};
		admCrtl.currentActive;
		admCrtl.classes = [];
		admCrtl.steps = [
			{
        templateUrl: 'admin/student-enroll-steps/activate.html',
        title: 'Activate Account',
        controller: 'stepCtrl'
    	},
    	{
        templateUrl: 'admin/student-enroll-steps/link.html',
        title: 'Link Parent'
    	},
    	{
        templateUrl: 'admin/student-enroll-steps/enroll.html',
        title: 'Enroll To Class'
    	}
		];

		$scope.$watch('admCrtl.newStudent.firstName', function(){
			if (!admCrtl.newStudent.lastName) {
				admCrtl.newStudent.lastName = "";
			}
			var user = admCrtl.newStudent.firstName +"."+admCrtl.newStudent.lastName;
			admCrtl.newStudent.username = ""; 
			admCrtl.newStudent.username = user.toLowerCase(); 
		});

		$scope.$watch('admCrtl.newStudent.lastName', function(){
			var user = admCrtl.newStudent.firstName +"."+admCrtl.newStudent.lastName;
			admCrtl.newStudent.username = ""; 
			admCrtl.newStudent.username = user.toLowerCase(); 
		});



		StaffService.getClasses().then(function(c){
			admCrtl.classes = c.result;
		});

		admCrtl.onStudentClick = function(s){
			admCrtl.parent = {};
			admCrtl.loaded = true;
			admCrtl.student = s;
			admCrtl.currentActive = admCrtl.student.isActive;

		};

		StudentService.GetAllStudents().then((students) => {
			// console.log(students.results);
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
			StudentService.GetParent(id).then((parent) =>{
				if (parent.role != 'parent') {
					throw new UserException('Not a Parent. Please ensure that the ID is correct.');
				}
				admCrtl._parent = {};
				admCrtl.parent = parent;
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

		admCrtl.linkParent = function(){
			StudentService.LinkParent(admCrtl.student.objectId, 
				admCrtl.parent.objectId).then((user) =>{
					admCrtl.student = user;
					for (var i = 0; i < admCrtl.students.length; i++) {
						if (admCrtl.students[i].objectId === admCrtl.student.objectId) {
							admCrtl.students[i] = admCrtl.student;
							toaster.pop('success', "Done!", admCrtl.students[i].firstName+" Linked!");
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
		admCrtl.removeLink = function(s){
			StudentService.RemoveLink(s.objectId).then((student) =>{
				admCrtl.student = $filter('filter')(admCrtl.students, function(d){
					return d.objectId === s.objectId;
				})[0];
				delete admCrtl.student.profile;
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

		admCrtl.class = {};


		admCrtl.addToClass = function(){
			StaffService.addToClass(admCrtl.class.objectId, admCrtl.student.objectId).then(function(c){
				toaster.pop('success', "Done!", admCrtl.student.firstName+" linked to class.");
				return c.result;
			}).then(function(d){
				return StudentService.updatePCID(d.class.objectId,d.student.objectId);
			});
		}

		admCrtl.clearParent = function(){
			admCrtl.parent = {};
		}

		$scope.$on('new-user', function(){
			if (!admCrtl.newStudent 
 				|| !admCrtl.newStudent.username 
 				|| !admCrtl.newStudent.email 
 				|| !admCrtl.newStudent.firstName
 				|| !admCrtl.newStudent.lastName) {
 				return;
 			}

 			admCrtl.newStudent.password = PasswordGenerator.generatePassword(10);
 			admCrtl.newStudent.passClear = admCrtl.newStudent.password;
 			admCrtl.newStudent.deleteClear = true;

 			StudentService.NewStudent(admCrtl.newStudent).then(function(u){
 				return StudentService.GetStudent(u.objectId);
 			}).then(function(stu){
 				toaster.pop('success', "Done!", stu.firstName+" added!");
 				admCrtl.students.unshift(stu);
 			}).catch(function(err){
 				toaster.pop('error', "Oops!", "Student not added!");
 			});

 		});

	}])
	.controller('AdminClassNewCtrl',['StaffService',function(StaffService){
		var admCNCrtl = this;
		admCNCrtl.class = {};
		admCNCrtl.submitClass = function(){
			StaffService.createClass(admCNCrtl.class).then(function(c){
				console.log(c);
			})
		}
	}])
	.controller('AdminStudentCtrl', [
		'$scope',
	 	'StudentService', 
	 	'toaster', 
	 	'LocalService',
	 	'UserService',
		function($scope, StudentService, toaster, LocalService, UserService){

			var sCtrl = this;

			sCtrl.student;

			$scope.$on('handleBroadcast', () =>{
				var id = LocalService.id;
				if (id) {
					StudentService.GetStudent(id).then((student) =>{
						sCtrl.student = student;
						return student.objectId;
					}).then((id) =>{
						return StudentService.GetStudentTodayAttendance(id);
					}).then((present) =>{
						sCtrl.student.present = present;
					}).catch((err) =>{
						toaster.pop('error', "Oops!", sCtrl.student.firstName+"'s attendance record for today is absent.");
					});
				}
			});

			sCtrl.markStudent = function() {
				if (sCtrl.student) {
					UserService.GetCurrent().then(function(user){
						return StudentService.MarkStudent(user.sessionToken, sCtrl.student.objectId);
					}).then((status) =>{
						sCtrl.student.present = status;
						toaster.pop('success', "Done!", sCtrl.student.firstName+"'s attendance recorded.");
					});
				}
			}

	}]);