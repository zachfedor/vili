
/**
 * authService.js
 */

angular.module('authService', [])

// auth factory to login and get info
// - inject $http for API communication
// - inject $q to return promise objects
// - inject AuthToken to manage tokens
    .factory('Auth', function($http, $q, AuthToken) {
        var authFactory = {};

        // handle login
        authFactory.login = function(email, password) {
            // console.log('logging in');

            return $http.post('/api/authenticate', {
                email: email,
                password: password
            })
                .success(function(data) {
                    AuthToken.setToken(data.token);
                    return data;
                });
        };

        // handle logout
        authFactory.logout = function() {
            // console.log('logging out');

            // clear the token
            AuthToken.setToken();
        };

        // check if user is logged in
        authFactory.isLoggedIn = function() {
            if (AuthToken.getToken()) {
                // console.log('login check: true');

                return true;
            } else {
                // console.log('login check: false');

                return false;
            }
        };

        // get user info
        authFactory.getUser = function() {
            if (AuthToken.getToken()) {
                return $http.get('/api/me', { cache: true });
            } else {
                return $q.reject({ message: 'User has no token.' });
            }
        };

        return authFactory;
    })

// authToken factory to handle tokens
// - inject $window to store token client-side
    .factory('AuthToken', function($window) {
        var authTokenFactory = {};

        // get the token
        authTokenFactory.getToken = function() {
            // console.log('trying to get the token');

            // console.log( $window.localStorage.getItem('token') );
            return $window.localStorage.getItem('token');
        };

        // set the token or clear it
        authTokenFactory.setToken = function(token) {
            if (token) {
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }
        };

        return authTokenFactory;
    })

// app configuration to integrate token into requests
    .factory('AuthInterceptor', function($q, $location, AuthToken) {
        var interceptorFactory = {};

        // attach the token to requests
        interceptorFactory.request = function(config) {
            // console.log('interceptor is getting the token');

            // grab the token
            var token = AuthToken.getToken();

            // console.log('interceptor got: ' + token);

            // add token to header if it exists
            if (token) {
                // console.log('token exists, adding it to header');

                config.headers['x-access-token'] = token;
            }

            return config;
        };

        // redirect if a token doesn't authenticate
        interceptorFactory.responseError = function(response) {
            // if server responds in 403 forbidden access
            if (response.status == 403) {
                // console.log('forbidden access, redirect to login page');

                AuthToken.setToken();
                $location.path('/login');
            }

            // return the errors from the server as a promise
            return $q.reject(response);
        };

        return interceptorFactory;
    });
