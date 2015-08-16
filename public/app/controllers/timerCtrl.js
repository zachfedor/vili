/**
 * timerCtrl.js
 */

angular.module('timerCtrl', ['timerService'])
    .controller('timerController', function($routeParams, Timer) {
        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        // grab the project at page load
        Timer.get($routeParams.project_id)
            .success(function(data) {
                vm.processing = false;

                vm.projectData = data;
            });

        vm.toggleTimer = function(id) {
            vm.processing = true;

            Timer.toggle(id)
                .success(function(data) {
                    vm.processing = false;

                    vm.message = data.message;
                });
        };

        vm.cancelTimer = function(id) {
            vm.processing = true;

            Timer.cancel(id)
                .success(function(data) {
                    vm.processing = false;

                    vm.message = data.message;
                });
        };
    });
