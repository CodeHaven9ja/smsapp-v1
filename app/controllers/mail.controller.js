(function() {
    'use strict';

    angular
        .module('app')
        .controller('MailController', MailController)
        .controller('MailDetailController', MailDetailController)
        .controller('MailComposeController', MailComposeController);


    MailComposeController.$inject = ['$scope', 'UserService', 'MessageService', '$state'];

    MailDetailController.$inject = ['$scope', '$stateParams', 'UserService', 'MessageService'];
    MailController.$inject = ['$scope', 'LocalService', '$rootScope', 'toaster', 'UserService', 'MessageService', '$state', 'mails'];

    function MailComposeController($scope, UserService, MessageService, $state) {
    	var mailCCtrl = this;
    	mailCCtrl.user = {};
    	mailCCtrl.message = {};
    	mailCCtrl.toUser;

      mailCCtrl.users = [];

    	UserService.GetCurrent().then(function (user){
    		mailCCtrl.user = user;
    	});

    	mailCCtrl.send = function (){
        mailCCtrl.users = mailCCtrl.message.toId.split(',');
        var message = {
          users : mailCCtrl.users,
          message : mailCCtrl.message
        };

        MessageService.newMessage(mailCCtrl.user.sessionToken, message).then((status) =>{
          $state.transitionTo('mail.inbox');
        }).catch((err) =>{
          console.log(err);
        });
    	}
    }
    function MailDetailController($scope, $stateParams, UserService, MessageService){
    	var mailDCtrl = this;
    	$scope.mailId = $stateParams.id;
    	$scope.mail = {};
    	UserService.GetCurrent().then(function (user){
	    	return MessageService.getMail(user.sessionToken, $scope.mailId);    		
    	}).then(function (mail){
    		$scope.mail = mail;
    	});
    }
    /* @ngInject */
    function MailController($scope, LocalService, $rootScope, toaster, UserService, MessageService, $state, mails) {
      var mailCtrl = this;
      mailCtrl.title = 'Mail';
      mailCtrl.mails = mails.emails;
      mailCtrl.unRead = mails.unRead;
      mailCtrl.inbox = mails.inbox;
      mailCtrl.outbox = mails.outbox;
      mailCtrl.mainBox = mails.inbox;
      mailCtrl.user = {};
      mailCtrl.isInbox = true;
      mailCtrl.mail = {};
      mailCtrl.newMessage = {};

      mailCtrl.toggle = function(i){
      	if (i == 1) {
      		mailCtrl.isInbox = false;
      		mailCtrl.mainBox = mailCtrl.outbox;
      		$state.transitionTo('mail.outbox');
      	} else {
      		mailCtrl.isInbox = true;
      		mailCtrl.mainBox = mailCtrl.inbox;
      		$state.transitionTo('mail.inbox');
      	}
      }

      mailCtrl.read = function (i) {
      	mailCtrl.mail = mailCtrl.mainBox[i];
      	$state.transitionTo('mail.read');
      }

      mailCtrl.send = function (subject, toId) {
      	console.log(subject, toId, mailCtrl.newMessage.text);
      	MessageService.newMessage(mailCtrl.user.sessionToken, mailCtrl.newMessage.text, toId).then(function(message){
      		console.log(message);
    			var mail = {
    				subject: subject,
    				to: {
    					"__type": "Pointer",
        			"className": "_User",
        			"objectId": toId
    				},
    				from:{
    					"__type": "Pointer",
        			"className": "_User",
        			"objectId": mailCtrl.user.objectId
    				},
    				"isRead": false,
    				"message": {
			        "__type": "Pointer",
			        "className": "Message",
			        "objectId": message.result.objectId
			      }
    			};
    			return MessageService.newMail(mailCtrl.user.sessionToken, mail);
      	}).then(function(mail){
      		return MessageService.getMail(mailCtrl.user.sessionToken, mail.objectId);
      	}).then( function(mail){
      		mailCtrl.mails.unshift(mail);
      		if (mail.to.objectId === mailCtrl.user.objectId){
      				mailCtrl.inbox.unshift(mail);
    			}

    			if (mail.from.objectId === mailCtrl.user.objectId) {
    				mailCtrl.outbox.unshift(mail);
    			}
      		$state.transitionTo('mail.inbox');
      	});
      }

      setup();

      mailCtrl.getUsername = function(mail){
      	UserService.GetUser(mail.from.objectId).then(function (user){
      		return user.firstName +" "+ user.lastName;
      	});
      }

      ////////////////

      function setup() {
      	// mailCtrl.mails = mails.results;
      	for (var i = 0; i < mailCtrl.mails.length; i++) {
    			if (mailCtrl.mails[i].to.objectId === mailCtrl.user.objectId){
      			if (!mailCtrl.mails[i].isRead){
      				mailCtrl.unRead++;
      			}
    				mailCtrl.inbox.push(mailCtrl.mails[i]);
    			}

    			if (mailCtrl.mails[i].from.objectId === mailCtrl.user.objectId) {
    				mailCtrl.outbox.push(mailCtrl.mails[i]);
    			}
    			mailCtrl.mainBox = mailCtrl.inbox;
    		}
      }
  		$state.transitionTo('mail.inbox');
  	}
})();