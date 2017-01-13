angular
    .module('fseChatClientApp')
    .factory('fseChatService', ['$rootScope', '$filter', '$http', function ($rootScope, $filter, $http) {
        function ChatService($scope) {
            this.$scope = $scope;

            this.apiUrl = "http://localhost:3000/";

        }

        ChatService.prototype.retrieveOnlineUsers = function (callback) {
            $http.get(this.apiUrl + "users").then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(error, status, headers, config) {
                console.log('Error retrieving users: ' + error);
            });
        };

        ChatService.prototype.retrieveAllMessages = function (callback) {
            $http.get(this.apiUrl + "messages").then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(error, status, headers, config) {
                console.log('Error retrieving messages: ' + error);
            });
        };

        ChatService.prototype.createMessage = function (msgObj, callback) {
            $http.post(this.apiUrl + "messages", msgObj).then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(error, status, headers, config) {
                console.log('Error submitting message: ' + error);
            });
        };

        ChatService.prototype.createUser = function (usrObj, callback) {
            $http.post(this.apiUrl + "users", usrObj).then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(error, status, headers, config) {
                console.log('Error submitting user: ' + error);
            });
        };

        ChatService.prototype.changeUserStatus = function (usrName, newstatus, callback) {
            var obj = {username: usrName, new_status: newstatus};
            $http.post(this.apiUrl + "users/change-status/", obj).then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(error, status, headers, config) {
                console.log('Error changing user status: ' + error);
            });
        };

        return ChatService;

    }]);
