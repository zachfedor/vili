/**
 * projectService.js
 */

angular.module('projectService', [])
    .factory('Project', function($http) {
        var projectFactory = {};

        // get a single project
        projectFactory.get = function(id) {
            return $http.get('/api/projects/' + id);
        };

        // get all projects
        projectFactory.all = function() {
            return $http.get('/api/projects/');
        };

        // create a project
        projectFactory.create = function(projectData) {
            return $http.post('/api/projects/', projectData);
        };

        // update a project
        projectFactory.update = function(id, projectData) {
            return $http.put('/api/projects/' + id, projectData);
        };

        // delete a project
        projectFactory.delete = function(id) {
            return $http.delete('/api/projects/' + id);
        };

        return projectFactory;
    });
