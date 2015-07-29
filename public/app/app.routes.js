/**
 * app.routes.js
 */

angular.module('app.routes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/pages/home.html'
            });

        $locationProvider.html5Mode(true);
    });
