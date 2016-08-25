(function () {
    'use strict';
    angular
        .module('app')
        .controller('ReportsCtrl',
            ['$scope','$window','$interval','$timeout','UserService',rpCrtl]
        ).controller('AttendanceCtrl',
            ['$scope','$window','$interval','$timeout','UserService',rcCrtl]
        ).directive('ngScore',function(){
            return {
                replace: false,
                scope: true,
                link: function(scope, element, attrs){
                    var e = element[0];
                    var ngScore, score;

                    var calculate = function(){
                        ngScore = parseInt(attrs.ngScore) || 0;
                        if (ngScore <=39) {
                            score = 'F';
                        } else if (ngScore >=40 && ngScore <= 45) {
                            score = 'E';
                        } else if (ngScore >= 46 && ngScore <= 65) {
                            score = 'C';
                        } else if (ngScore >= 66 && ngScore <= 100) {
                            score = 'A';
                        }
                        e.innerText = score;
                    }

                    var start = function () {
                        calculate();
                    }

                    attrs.$observe('ngScore', function (val){
                        if (val) {
                            start();
                        }
                    });
                }
            };
        });

        function rpCrtl($scope,$window,$interval,$timeout,UserService) {
            var rpCrtl = this;
            rpCrtl.students = [];
            rpCrtl.currentStudent = {};

            UserService.GetCurrent().then(function(user){
                rcCrtl.user = user;
                // Query student from params
                return user;
            }).then(function(user){
                rpCrtl.currentStudent = user;
                rpCrtl.currentStudent.results = [
                    {
                        subject : 'Mathematics',
                        score: 12
                    },
                    {
                        subject : 'English Language',
                        score: 56
                    },
                    {
                        subject : 'Chemistry',
                        score: 48
                    },
                    {
                        subject : 'Biology',
                        score: 82
                    },
                    {
                        subject : 'History',
                        score: 97
                    },
                    {
                        subject : 'Economics',
                        score: 65
                    },
                    {
                        subject : 'Physics',
                        score: 55
                    },
                    {
                        subject : 'Geography',
                        score: 71
                    },
                    {
                        subject : 'Technical Drawing',
                        score: 73
                    }
                ];
                rpCrtl.currentStudent.reports = [
                    {
                        teacher : "Garba Ali",
                        remark : "Caught jumping the fence today. Adviced to inform your parents to visit the school."
                    },
                    {
                        teacher : "Ene Abah",
                        remark : "Baked a wonderful loaf of bread during Home Economics class. Well done!"
                    },
                    {
                        teacher : "Dotun Olayinka",
                        remark : "School fees are due."
                    }
                ];
            });
        }
        
        function rcCrtl($scope,$window,$interval,$timeout,UserService) {
        	// console.log($window.jwtToken)
        	var rcCrtl = this;
            rcCrtl.attendance = [];
            rcCrtl.students = [];
            rcCrtl.currentStudent = {};
            UserService.GetCurrent().then(function(user){
                rcCrtl.user = user;
                // Query student from params
                return user;
            }).then(function(user){
                rcCrtl.currentStudent = user;
                rcCrtl.attendance = [
                    {
                        createdAt: '2016-08-20T12:32:56.982Z',
                        status: false
                    },
                    {
                        createdAt: '2016-08-19T20:43:12.685Z',
                        status: true
                    },
                    {
                        createdAt: '2016-08-18T20:26:42.479Z',
                        status: true
                    },
                    {
                        createdAt: '2016-08-17T12:32:56.520Z',
                        status: true
                    }
                ];
                rcCrtl.currentStudent.attendance = rcCrtl.attendance;
            });
        }
})();