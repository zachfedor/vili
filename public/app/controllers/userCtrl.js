/**
 * userCtrl.js
 */

angular.module('userCtrl', ['userService'])
    .controller('userController', function(User) {
        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        // grab all the users at page load
        User.all()
            .success(function(data) {
                vm.processing = false;

                vm.users = data;
            });

        // function to delete a user
        vm.deleteUser = function(id) {
            vm.processing = true;

            User.delete(id)
                .success(function(data) {
                    // get all users to update the table
                    // you can also set up your api
                    // to return the list of users with the delete call
                    User.all()
                        .success(function(data) {
                            vm.processing = false;

                            vm.users = data;
                        });
                });
        };
    })

    .controller('userCreateController', function(User) {
        var vm = this;

        // variable to show/hide elements of the view
        // to differentiate between create or edit pages
        vm.type = 'create';

        // function to save a user
        vm.saveUser = function() {
            vm.processing = true;
            vm.message = '';

            // use the create function in the userService
            User.create(vm.userData)
                .success(function(data) {
                    vm.processing = false;

                    // clear the form
                    vm.userData = {};

                    // bind the message from our api to vm.message
                    vm.message = data.message;
                });
        };
    })

    // controller applies to user edit page
    .controller('userEditController', function($routeParams, User) {
        var vm = this;

        // variable to control hide/show elements in view
        vm.type = 'edit';

        // get the user data for the user to edit
        // route params grabs it from url
        User.get($routeParams.user_id)
            .success(function(data) {
                vm.userData = data;
            });

        // function to save the user
        vm.saveUser = function() {
            vm.processing = true;
            vm.message = '';

            // call the userService update function
            User.update($routeParams.user_id, vm.userData)
                .success(function(data) {
                    vm.processing = false;

                    // clear the form after update
                    vm.userData = {};

                    // bind the api message to vm.message to display on form
                    vm.message = data.message;
                });
        };
    });
