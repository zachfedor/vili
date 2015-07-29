/**
 * app.routes.js
 */

angular.module('app.routes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            // homepage route
            .when('/', {
                templateUrl: 'views/pages/home.html'
            })

            // login route
            .when('/login', {
                templateUrl: 'views/pages/login.html',
                controller: 'mainController',
                controllerAs: 'login'
            });

        $locationProvider.html5Mode(true);
    });
