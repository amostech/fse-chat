'use strict';

angular.module('fseChatClientApp')
  .controller('FseLoginController', ['$scope', 'fseChatService', '$localStorage', '$window', 'fseSocket', function ($scope, ChatService, $localStorage, $window, fseSocket) {

    var service = new ChatService();

    $scope.errorBox = "";
    
    $scope.user = {
      username: "",
      status: "online"
    };

    var retrieveUserList = function () {
      if($localStorage.loggedInUser) {
        service.retrieveOnlineUsers(function (data) {
          $scope.onlineUsers = data;
        });
      }
    };


    fseSocket.on('user-list-changed', function (data) {
      console.log('USER LIST CHANGED');
      retrieveUserList();
    });

    $scope.loginOrCreate = function () {
      $scope.user.status = "online";
      service.createUser($scope.user, function (data) {
        console.log(data);
        if(!data.error) {
          $localStorage.status = 'LOGGED_IN'
          $localStorage.loggedInUser = data;
          $window.location.href = '/'
          fseSocket.emit('login', { username: $localStorage.loggedInUser.username });
        } else {
          $scope.errorBox = data.error;
        }
      });

    };

    $scope.doLogout = function () {
      fseSocket.emit('logout', { username: $localStorage.loggedInUser.username });
      delete $localStorage.loggedInUser
      delete $localStorage.status
      $window.location.href = '/'
    }

    $scope.onlineUsers = [];
    if ($localStorage.status !== 'LOGGED_IN') {
      console.log('User not logged in...');
    } else {
      console.log('User logged in...');
      console.log($localStorage)
      $scope.loggedInUser = $localStorage.loggedInUser;
      retrieveUserList();
    }

  }]);