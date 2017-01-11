(function() {
    'use strict';

    angular
        .module('app')
        .controller('MailController', MailController);

    MailController.$inject = ['$scope', 'LocalService', '$rootScope', 'toaster', 'UserService', 'MessageService'];

    /* @ngInject */
    function MailController($scope, LocalService, $rootScope, toaster, UserService, MessageService) {
        var mailCtrl = this;
        mailCtrl.title = 'Mail';
        mailCtrl.mails = [];
        mailCtrl.unRead = 0;
        mailCtrl.inbox = [];
        mailCtrl.outbox = [];
        mailCtrl.mainBox = [];
        mailCtrl.user = {};
        mailCtrl.isInbox = true;

        mailCtrl.toggle = function(i){
        	if (i == 1) {
        		mailCtrl.isInbox = false;
        		mailCtrl.mainBox = mailCtrl.outbox;
        	} else {
        		mailCtrl.isInbox = true;
        		mailCtrl.mainBox = mailCtrl.inbox;
        	}

        	console.log(mailCtrl.isInbox);
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

    }
})();