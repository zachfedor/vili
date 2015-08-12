/**
 * projectCtrl.js
 */

angular.module('projectCtrl', ['projectService'])
    .controller('projectController', function(Project) {
        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        // grab all the projects at page load
        Project.all()
            .success(function(data) {
                vm.processing = false;

                vm.projects = data;
            });

        // function to delete a project
        vm.deleteProject = function(id) {
            console.log('delete a project');
            vm.processing = true;

            Project.delete(id)
                .success(function(data) {
                    // get all projects to update the table
                    Project.all()
                        .success(function(data) {
                            vm.processing = false;

                            vm.projects = data;
                        });
                });
        };
    })

    .controller('projectCreateController', function(Project) {
        var vm = this;

        // variable to show/hide elements of the view
        // to differentiate between create or edit pages
        vm.type = 'create';

        // function to save a project
        vm.saveProject = function() {
            vm.processing = true;
            vm.message = '';

            // use the create function in the projectService
            Project.create(vm.projectData)
                .success(function(data) {
                    vm.processing = false;

                    // clear the form
                    vm.projectData = {};

                    // bind the message from our api to vm.message
                    vm.message = data.message;
                });
        };
    })

    // controller applies to project edit page
    .controller('projectEditController', function($routeParams, Project) {
        var vm = this;
        console.log('project edit controller');

        // variable to control hide/show elements in view
        vm.type = 'edit';

        // get the project data for the project to edit
        // route params grabs it from url
        Project.get($routeParams.project_id)
            .success(function(data) {
                vm.projectData = data;
            });

        // function to save the project
        vm.saveProject = function() {
            vm.processing = true;
            vm.message = '';

            // call the projectService update function
            Project.update($routeParams.project_id, vm.projectData)
                .success(function(data) {
                    vm.processing = false;

                    // clear the form after update
                    vm.projectData = {};

                    // bind the api message to vm.message to display on form
                    vm.message = data.message;
                });
        };
    });
