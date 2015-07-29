/**
 * mainCtrl.js
 */

angular.module('mainCtrl', [])
    .controller('mainController', function($rootScope, $location, Auth) {
        var vm = this;

        // get info if user is logged in
        vm.loggedIn = Auth.isLoggedIn();

        // check to see if a user is logged in on every request
        $rootScope.$on('$routeChangeStart', function() {
            vm.loggedIn = Auth.isLoggedIn();

            // get user info on route change
            Auth.getUser()
                .success(function(data) {
                    vm.user = data;
                });
        });

        // function to handle login form
        vm.doLogin = function() {
            // call the Auth.login function
            Auth.login(vm.loginData.email, vm.loginData.password)
                .success(function(data) {
                    $location.path('/users');
                });
        };

        // function to handle logging out
        vm.doLogout = function() {
            Auth.logout();

            // reset user info
            vm.user = {};
            $location.path('/login');
        };
    });
