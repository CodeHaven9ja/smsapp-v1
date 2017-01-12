(function() {
    'use strict';

    angular
        .module('app')
        .controller('MailController', MailController);

    MailController.$inject = ['$scope', 'LocalService', '$rootScope', 'toaster', 'UserService', 'MessageService', '$state'];

    /* @ngInject */
    function MailController($scope, LocalService, $rootScope, toaster, UserService, MessageService, $state) {
      var mailCtrl = this;
      mailCtrl.title = 'Mail';
      mailCtrl.mails = [];
      mailCtrl.unRead = 0;
      mailCtrl.inbox = [];
      mailCtrl.outbox = [];
      mailCtrl.mainBox = [];
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

      	console.log(mailCtrl.isInbox);
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
      		console.log(mail);
      		mailCtrl.unRead++;
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
      	UserService.GetCurrent().then(function (user){
      		mailCtrl.user = user;
      		return MessageService.getMails(user.sessionToken);
      	}).then(function (mails){
      		mailCtrl.mails = mails.results;
      		for (var i = 0; i < mailCtrl.mails.length; i++) {
      			if (!mailCtrl.mails[i].isRead){
      				mailCtrl.unRead++;
      			}
      			if (mailCtrl.mails[i].to.objectId === mailCtrl.user.objectId){
      				mailCtrl.inbox.push(mailCtrl.mails[i]);
      			}

      			if (mailCtrl.mails[i].from.objectId === mailCtrl.user.objectId) {
      				mailCtrl.outbox.push(mailCtrl.mails[i]);
      			}
      			mailCtrl.mainBox = mailCtrl.inbox;
      		}
      		console.log(mailCtrl.mails);
      	});
      }
  		$state.transitionTo('mail.inbox');
  	}
})();