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
                .then(function(data) {
                    vm.user = data;
                });
        });

        // function to handle login form
        vm.doLogin = function() {
            vm.processing = true;
            vm.error = '';

            // call the Auth.login function
            Auth.login(vm.loginData.email, vm.loginData.password)
                .success(function(data) {
                    vm.processing = false;
                    if (data.success) {
                        $location.path('/users');
                    } else {
                        vm.error = data.message;
                    }
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
