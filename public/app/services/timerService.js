/**
 * timerService.js
 */

angular.module('timerService', [])
    .factory('Project', function($http) {
        var timerFactory = {};

        // get a single project
        timerFactory.get = function(id) {
            return $http.get('/api/timer/' + id);
        };

        // toggle timer on project
        timerFactory.put = function(id) {
            return $http.put('/api/timer/' + id);
        };

        // cancel timer on project
        timerFactory.delete = function(id) {
            return $http.delete('/api/timer/' +id);
        };
    });
