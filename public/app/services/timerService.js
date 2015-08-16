/**
 * timerService.js
 */

angular.module('timerService', [])
    .factory('Timer', function($http) {
        var timerFactory = {};

        // get a single project
        timerFactory.get = function(id) {
            return $http.get('/api/timer/' + id);
        };

        // toggle timer on project
        timerFactory.toggle = function(id) {
            return $http.put('/api/timer/' + id);
        };

        // cancel timer on project
        timerFactory.cancel = function(id) {
            return $http.delete('/api/timer/' +id);
        };
    });
