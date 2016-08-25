(function () {
    'use strict';
    angular
        .module('app')
        .controller('HomeCtrl',['$scope','$window','$interval','$timeout','UserService',hmCrtl]);
        function hmCrtl($scope,$window,$interval,$timeout,UserService) {
        	// console.log($window.jwtToken)
        	var hmCrtl = this;
            UserService.GetCurrent().then(function(user){
                hmCrtl.user = user;
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