(function () {
	'use strict';
	angular
        .module('app',[
        	'ui.router',
            'ui.gravatar',
            'ui.bootstrap',
            'angularUtils.directives.dirPagination',
            'easypiechart',
            'ui.calendar',
            'studentSearchBox',
            'toaster', 
            'ngAnimate',
            'uiSwitch',
            'multiStepForm',
            'countTo',
        	])
        .config(config)
        .controller('stepCtrl', ['$scope', 'multiStepFormInstance', 
          function ($scope, multiStepFormInstance){
            $scope.clearParent = function(){
              $scope.parent = {};
              multiStepFormInstance.setActiveIndex(1);
            }
        }])
        .run(run)
        .filter('capitalize', function() {
            return function(input) {
              return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
            }
        });
        function config($stateProvider, $urlRouterProvider) {
        	// default route
            $urlRouterProvider.otherwise("/");
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'home/index.html',
                    controller: 'HomeCtrl',
                    controllerAs: 'hmCrtl'
                })
                .state('studentsAttendance', {
                    url: '/students/attendance/:studentId',
                    templateUrl: 'records/attendance.html',
                    controller: 'AttendanceCtrl',
                    controllerAs: 'rcCrtl'
                })
                .state('studentsRecords', {
                    url: '/students/records/:studentId',
                    templateUrl: 'records/records.html',
                    controller: 'ReportsCtrl',
                    controllerAs: 'rpCrtl'
                })
                .state('studentsTimetable', {
                    url: '/students/timetable/:studentId',
                    templateUrl: 'curr/timetable.html',
                    controller: 'TimeTableCtrl',
                    controllerAs: 'ttCrtl'
                })
                .state('studentsEvents', {
                    url: '/students/events/:studentId',
                    templateUrl: 'curr/events.html',
                    controller: 'EventsCtrl',
                    controllerAs: 'evCrtl'
                })
                .state('news', {
                    url: '/news',
                    templateUrl: 'curr/news.html',
                    controller: 'NewsCtrl',
                    controllerAs: 'nwCrtl'
                })
                .state('adminEnroll', {
                    url: '/admin/enroll',
                    templateUrl: 'admin/enroll.html',
                    controller: 'AdminCtrl',
                    controllerAs: 'admCrtl'
                })
                .state('adminParents', {
                    url: '/parents',
                    templateUrl: 'admin/parents.html',
                    controller: 'AdminParentsCtrl',
                    controllerAs: 'admPCrtl'
                })
                .state('adminStaff', {
                    url: '/staff',
                    templateUrl: 'admin/staff.html',
                    controller: 'AdminStaffCtrl',
                    controllerAs: 'admSCrtl'
                })
                .state('adminAttendance', {
                    url: '/admin/attendance',
                    templateUrl: 'admin/attendance.html',
                    controller: 'AdminAttendanceCtrl',
                    controllerAs: 'admACrtl'
                })
                .state('adminDemograph', {
                    url: '/admin/demography',
                    templateUrl: 'admin/demography.html',
                    controller: 'AdminDemographCtrl',
                    controllerAs: 'admDCrtl'
                })
                .state('adminReport', {
                    url: '/admin/reports',
                    templateUrl: 'teacher/teacher.result.html',
                    controller: 'TeacherReportCtrl',
                    controllerAs: 'tRCtrl'
                })
                .state('adminClassNew', {
                    url: '/class/new',
                    templateUrl: 'admin/class/new.html',
                    controller: 'AdminClassNewCtrl',
                    controllerAs: 'admCNCrtl'
                })
                .state('parentListChildren', {
                    resolve: {
                        students: function(ParentService, UserService, StudentService, $q){
                            var children = [];
                            var parent = null;
                            return UserService.GetCurrent().then(function(user){
                                parent = user;
                                return ParentService.GetChildren(user);
                            }).then(function(students){
                                var r = [];
                                for (var i = 0; i < students.results.length; i++){
                                    var s = students.results[i].user;
                                    r.push(StudentService.GetStudentClass(s.user.objectId, parent).then(function(clazz){
                                        if (clazz.result) {
                                            s.class = clazz.result;
                                        } else {
                                            s.class = {
                                                commonName: 'Not assigned to a class.'
                                            }
                                        }
                                        return s;
                                    }));
                                };
                                return $q.all(r);
                            }).then(function(res){
                                for (var i = 0; i < res.length; i++) {
                                    var c = res[i];
                                    children.push(c);
                                }
                                return children;
                            });
                        }
                    },
                    url: '/parent/list-children',
                    templateUrl: 'parent/list-children.html',
                    controller: 'ParentListCtrl',
                    controllerAs: 'pListCrtl'
                })
                .state('teacherEnroll', {
                    url: '/teacher/enroll',
                    templateUrl: 'admin/enroll.html',
                    controller: 'AdminCtrl',
                    controllerAs: 'admCrtl'
                })
                .state('profile', {
                    resolve: {
                        user: function(UserService, $stateParams){
                            var id = $stateParams.id;
                            return UserService.GetUser(id).then(function(user){
                                return user;
                            });
                        }, 
                        school: function(UserService, $stateParams) {
                            var id = $stateParams.id;
                            return UserService.GetUser(id).then(function(user){
                                return user.school;
                            }).then(function(s){
                                return UserService.GetSchool(s.objectId);
                            });
                        }
                    },
                    url:'/profile/:id',
                    templateUrl: 'blocks/profile.html',
                    controller: 'ProfileController as $ctrl'
                })
                .state('profile.account',{
                    url:'/account',
                    controller: 'ProfileController as $ctrl',
                    templateUrl:'blocks/profile/account.html'
                })
                .state('profile.address',{
                    resolve:{
                        profile: function(UserService, user){
                            return UserService.GetProfile(user);
                        }
                    },
                    url:'/address',
                    templateUrl:'blocks/profile/address.html',
                    controller: 'ProfileAddressConntroller as $ctrl'
                })
                .state('profile.social',{
                    url:'/social',
                    templateUrl:'blocks/profile/address.html',
                    controller: 'ProfileController as $ctrl'
                })
                .state('school', {
                    url:'/school/:id',
                    template: "<h1>Hi</h1>"
                })
                .state('teacher', {
                    url: '/teacher',
                    templateUrl: 'teacher/teacher.index.html', 
                    controller: function(){

                    }
                })
                .state('teacher.report', {
                    url: '/report',
                    templateUrl: 'teacher/teacher.result.html',
                    controller: 'TeacherReportCtrl',
                    controllerAs: 'tRCtrl'
                }).state('teacher.report.detail',{
                    url: '/:id',
                    templateUrl: 'blocks/reports.html',
                    controller: 'ReportController',
                    controllerAs: 'rCtrl'
                })
                .state('mail', {
                    resolve: {
                        mails : function(UserService, MessageService){
                            var u = {};
                            return UserService.GetCurrent().then(function (user){
                                u = user;
                                return MessageService.getMails(u.sessionToken);
                            }).then(function(mails){
                                var emails = mails.results;
                                var mail = {};
                                mail.inbox = [];
                                mail.outbox = [];
                                mail.emails = emails;
                                mail.unRead = 0;
                                for (var i = 0; i < emails.length; i++) {
                                    if (emails[i].to.objectId === u.objectId){
                                    if (!emails[i].isRead){
                                        mail.unRead++;
                                    }
                                        mail.inbox.push(emails[i]);
                                    }

                                    if (emails[i].from.objectId === u.objectId) {
                                        mail.outbox.push(emails[i]);
                                    }
                                }
                                return mail;
                            });
                        }
                    },
                    url: '/mail',
                    templateUrl: 'mail/index.html',
                    controller: 'MailController',
                    controllerAs: 'mailCtrl'
                })
                .state('mail.inbox',{
                    url: '/inbox',
                    templateUrl: 'mail/inbox.html'
                })
                .state('mail.outbox',{
                    url: '/outbox',
                    templateUrl: 'mail/inbox.html'
                })
                .state('mail.compose', {
                    url: '/compose',
                    templateUrl: 'mail/new.html',
                    controller: 'MailComposeController',
                    controllerAs: 'mailCCtrl'
                })
                .state('mail.read', {
                    url: '/:id',
                    templateUrl: 'mail/read.html',
                    controller: 'MailDetailController',
                    controllerAs: 'mailDCtrl'
                })
                .state('fees',{
                    url: '/fees',
                    templateUrl: 'fees/index.html',
                    controller: function($state){
                        // $state.go('fees.list');
                    }
                }).state('fees.list',{
                    url: '/list',
                    templateUrl: 'fees/list.html',
                    controller: 'FeesController as feesCtrl'
                }).state('fees.list.detail',{
                    url:'/:id',
                    templateUrl: 'fees/details.html',
                    controller: 'FeesDetailController as feesDCtrl'
                });
        }
        function run($http, $rootScope, $window) {
        	// body...
        }
        // manually bootstrap angular after the JWT token is retrieved from the server
	    $(function () {
	        // get JWT token from server
            $.get('/token', function (token) {
                window.jwtToken = token;
                angular.bootstrap(document, ['app']);
            });
	    });
})();