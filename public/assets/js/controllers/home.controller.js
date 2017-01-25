(function () {
    'use strict';
    angular
        .module('app')
        .controller('HomeCtrl',['$scope','$window','$interval','$timeout','UserService', 'StudentService',hmCrtl]);
        function hmCrtl($scope,$window,$interval,$timeout,UserService,StudentService) {
        	// console.log($window.jwtToken)
        	var hmCrtl = this;
            UserService.GetCurrent().then(function(user){
                hmCrtl.user = user;
                return StudentService.getFeeByUser(user.sessionToken);
            }).then(function(fee){
                console.log(fee);
                hmCrtl.fee = fee.results[0];
            });
        	hmCrtl.to = 0;
        	hmCrtl.todo = {};
        	hmCrtl.todo.tasks = [
        		{
        			done  : 0,
        			title : "Donec ullamcorper nulla non metus auctor fringilla." 
        		},
        		{
        			done  : 1,
        			title : "Donec ullamcorper nulla non metus auctor fringilla." 
        		}
        	];

        	hmCrtl.count = hmCrtl.todo.tasks.length;
            hmCrtl.percent = 80;
            hmCrtl.options = {
                animate:{
                    duration:1000,
                    enabled:true
                },
                barColor:'#2C3E50',
                scaleColor:false,
                lineWidth:20,
                lineCap:'circle'
            };
        }
})();