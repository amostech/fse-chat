'use strict';

/**
 * @ngdoc function
 * @name fseChatClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fseChatClientApp
 */
angular.module('fseChatClientApp')
  .controller('FseMainController', ['$scope', 'fseChatService', '$timeout', 'fseSocket', '$localStorage', '$window', function ($scope, ChatService, $timeout, fseSocket, $localStorage, $window) {

    if ($localStorage.status !== 'LOGGED_IN') {
      console.log('User not logged in...');
      $window.location.href = '/#!/login';
    } else {
      console.log('User logged in...');
      console.log($localStorage)
      $scope.loggedInUser = $localStorage.loggedInUser;
    }

    var service = new ChatService();

    $scope.localMessage = "";
    $scope.sendMessage = function () {
      console.log('Request to send this message: ' + $scope.localMessage);
      var msgObj = {
        sender: { username: $scope.loggedInUser.username },
        message: $scope.localMessage
      };

      service.createMessage(msgObj, function () {
      });

      $scope.localMessage = "";
      rollAutoScrollDiv();

    };

    $scope.messages = [];
    service.retrieveAllMessages(function (data) {
      $scope.messages = data;
      rollAutoScrollDiv();
    });

    fseSocket.on('message-broadcast', function (data) {
      console.log('BROADCAST RECEIVED');
      $scope.messages.push(data);
      rollAutoScrollDiv();
    });

    var rollAutoScrollDiv = function () {
      $timeout(function () {
        var scroller = document.getElementById("autoscroll");
        scroller.scrollTop = scroller.scrollHeight;
      }, 0, false);
    };

  }]);
