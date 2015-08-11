/**
 * app.routes.js
 */

angular.module('app.routes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            // homepage route
            .when('/', {
                templateUrl: 'app/views/pages/home.html'
            })

            // login route
            .when('/login', {
                templateUrl: 'app/views/pages/login.html',
                controller: 'mainController',
                controllerAs: 'login'
            })

            // sign up route
            .when('/signup', {
                templateUrl: 'app/views/pages/login.html',
                controller: 'signupController',
                controllerAs: 'login'
            })

            // display all projects route
            .when('/projects', {
                templateUrl: 'app/views/pages/projects/all.html',
                controller: 'projectController',
                controllerAs: 'project'
            })

            // create single project route
            .when('/projects/create', {
                templateUrl: 'app/views/pages/projects/single.html',
                controller: 'projectCreateController',
                controllerAs: 'project'
            })

            // display single project route
            .when('/project/:project_id', {
                templateUrl: 'app/views/pages/projects/single.html',
                controller: 'projectEditController',
                controllerAs: 'project'
            })

            // display users route
            .when('/users', {
                templateUrl: 'app/views/pages/users/all.html',
                controller: 'userController',
                controllerAs: 'user'
            })

            // create single user route
            .when('/users/create', {
                templateUrl: 'app/views/pages/users/single.html',
                controller: 'userCreateController',
                controllerAs: 'user'
            })

            // display single user route
            .when('/users/:user_id', {
                templateUrl: 'app/views/pages/users/single.html',
                controller: 'userEditController',
                controllerAs: 'user'
            });

        $locationProvider.html5Mode(true);
    });
