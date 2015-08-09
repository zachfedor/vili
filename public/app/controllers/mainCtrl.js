/**
 * mainCtrl.js
 */

angular.module('mainCtrl', [])
    .controller('mainController', function($rootScope, $location, Auth) {
        var vm = this;

        // for show/hide on view
        vm.type = 'main';

        // get info if user is logged in
        vm.loggedIn = Auth.isLoggedIn();

        // check to see if a user is logged in on every request
        $rootScope.$on('$routeChangeStart', function() {
            vm.loggedIn = Auth.isLoggedIn();

            // get user info on route change
            Auth.getUser()
                .then(function(data) {
                    vm.user = data.data;
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
            vm.user = '';

            $location.path('/login');
        };

        vm.createSample = function() {
            Auth.createSampleUser();
        };
    })

    .controller('signupController', function($rootScope, $location, Auth) {
        var vm = this;

        // for show/hide on view
        vm.type = 'signup';

        // get info if user is logged in
        vm.loggedIn = Auth.isLoggedIn();

        if (vm.loggedIn) {
            $location.path('/');
        } else {
            vm.doLogin = function() {
                vm.processing = true;
                vm.error = '';

                if (vm.loginData.password == vm.loginData.passwordVerify) {
                    // call the Auth.signUp function
                    Auth.signUp(vm.loginData.email, vm.loginData.password)
                        .success(function(data) {
                            vm.processing = false;
                            if (data.success) {
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
                            } else {
                                vm.error = data.message;
                            }
                        });
                } else {
                    vm.processing = false;
                    vm.error = 'Passwords do not match';
                }
            };
        }
    });
