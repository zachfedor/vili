/**
 * app.js
 */

// name the app
angular.module('vili', ['stuffService'])

    // inject $http into controller
    .controller('mainController', function($http) {
        // bind this to vm (view-model)
        var vm = this;
        // define variables and objects on this
        // this lets them be available to our views

        // make the API call
        $http.get('/api/users')
            .then(function(data) {
                // bind the users we receive to vm.users
                vm.users = data.users;
            });
    })
    .controller('userController', function(Stuff) {
        var vm = this;

        Stuff.all()
            .success(function(data) {
                vm.stuff = data;
            });
    });
