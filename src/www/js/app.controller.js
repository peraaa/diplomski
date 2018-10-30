(function () {
    'use strict';

    var app = angular.module('myApp', []);
    app.controller('AppCtrl', AppController);

    // AppController.$inject = ['$rootScope', '$scope', '$http'];
    function AppController($rootScope, $scope, $http) {
        var vm = this;
        vm.username = $rootScope.loggedUser;
        vm.password = '';

        vm.message = '';
        vm.users = [];


        vm.login = function(){
            var req = {
                method: 'GET',
                url: '/api/users/login?username='+vm.username+'&password='+vm.password,
                headers: {'auth-token': '123'}
            }
            $http(req).then(function(resp){
                console.log(resp)
                vm.message = resp;
            }, function(err){
                vm.message = err;
            });
        }

        vm.getUsers = function(){
            var req = {
                method: 'GET',
                url: '/api/users',
                headers: {'auth-token': '123'}
            }
            $http(req).then(function(resp){
                vm.users = resp.data;
            }, function(err){
                vm.message = err;
            });
        }

        vm.createUser = function(){
            var req = {
                method: 'POST',
                url: '/api/users/add',
                headers: {'auth-token': '123'},
                data: {'username':vm.username, 'password':vm.password}
            }
            $http(req).then(function(resp){
                vm.getUsers();
            }, function(err){
                vm.message = err;
            });
        }

        vm.logout = function(){
            $rootScope.loggedUser = null;
            $state.go('login');
        }

        vm.getUsers();
    }
})();
