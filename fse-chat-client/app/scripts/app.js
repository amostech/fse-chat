'use strict';

/**
 * @ngdoc overview
 * @name fseChatClientApp
 * @description
 * # fseChatClientApp
 *
 * Main module of the application.
 */
angular
  .module('fseChatClientApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'FseMainController',
        controllerAs: 'main'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'FseLoginController',
        controllerAs: 'login'
      })
  })
  ;
