(function () {
    'use strict';

    angular
        .module('app').factory('MessageService', Service);

        function Service($http, $q, $httpParamSerializerJQLike, UserService) {
        	var service = {};

            var unRead = 0;

        	service.getMessages = GetMessages;
            service.getMessage = GetMessage;
            service.getMails = GetMails;
            service.getMail = GetMail;
            service.newMessage = NewMessage;
            service.newMail = NewMail;
            service.getUnreadCount = GetUnreadCount;

        	return service;

            function GetUnreadCount(m, user) {
                var mail = {};
                mail.mails = [];
                unRead = 0;
                for (var i = 0; i < m.length; i++) {
                    if (m[i].to.objectId === user.objectId) {
                        if (!m[i].isRead) {
                            unRead++;
                        }
                        mail.mails.push(m[i]);
                    }   
                }
                mail.unread = unRead;
                return mail;
            }

            function GetMessage(token, id) {
                return $http({
                    method:"GET", 
                    url:'/1/classes/Message/'+id, 
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
                        "X-Parse-Session-Token":token
                    }, 
                    cache: true
                }).then(handleSuccess, handleError);
            }

        	function GetMessages(token) {
            	return $http({
                    method:"GET", 
                    url:'/1/classes/Newsletter', 
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
                        "X-Parse-Session-Token":token
                    }, 
                    cache: true
                }).then(handleSuccess, handleError);
        	}

            function GetMails(token){
                return $http({
                    method:"GET", 
                    url:'/1/classes/Mail?include=from&include=message&include=to&order=-createdAt', 
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
                        "X-Parse-Session-Token":token
                    }, 
                    cache: true
                }).then(handleSuccess, handleError);
            }

            function GetMail(token, id){
                return $http({
                    method:"GET", 
                    url:'/1/classes/Mail/'+id+'?include=from&include=message&include=to', 
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
                        "X-Parse-Session-Token":token
                    }, 
                    cache: true
                }).then(handleSuccess, handleError);
            }

            function NewMessage(token, text, toId) {
                return $http({
                    method:"POST", 
                    url:'/1/functions/newMessage', 
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
                        "X-Parse-Session-Token":token
                    },
                    data:{
                        toId: toId,
                        text: text
                    }
                }).then(handleSuccess, handleError);
            }

            function NewMail(token, mail) {
                return $http({
                    method:"POST", 
                    url:'/1/classes/Mail', 
                    headers:{
                        "X-Parse-Application-Id":"9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC",
                        "X-Parse-Session-Token":token
                    },
                    data:mail
                }).then(handleSuccess, handleError);
            }

            // private functions

            function handleSuccess(res) {
                return res.data;
            }

            function handleError(res) {
                return $q.reject(res.data);
            }
        }

})();