(function () {
    'use strict';

    var app = angular.module('myApp', []);
    app.controller('AppCtrl', AppController);

    // AppController.$inject = ['$rootScope', '$scope', '$http'];
    function AppController($rootScope, $scope, $http) {
        var vm = this;
        vm.username = $rootScope.loggedUser;
        vm.password = '';
        vm.autorizovan = false;
        vm.message = '';
        vm.users = [];


        vm.login = function(){
            if(vm.autorizovan == true)
                {
                    vm.message = "Morate se prvo izlogovati!";
                }
            else{
            var req = {
                method: 'GET',
                url: '/api/users/login?username='+vm.username+'&password='+vm.password,
                headers: {'auth-token': '123'}
            }
            if(vm.password == '1234' && vm.username =='djordje'){
                vm.message = "Prijavljen je korisnik: "+vm.username;
                vm.autorizovan = true;
            }
                else if(vm.password == '4321' && vm.username =='petar')
                {
                    vm.message = "Prijavljen je korisnik: "+vm.username;
                    vm.autorizovan = true;
                }
              else
              {
                vm.message = "Pogresno korisnicko ime i/ili lozinka!";
              }
              if(vm.password == '' || vm.username == '')
                {
                    alert("Morate uneti korisnicko ime i sifru!");
                }
            $http(req).then(function(resp){
                console.log(resp)
                /*vm.message = resp;*/
            }, function(err){
                vm.message = err;
            });
        }
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
            if(vm.autorizovan == true)
                {
                    vm.message = "Morate se prvo izlogovati!";
                }
            else{
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
        }

        vm.logout = function(){
           vm.password = "";
           vm.autorizovan = false;
           vm.message = "Hvala sto ste koristili aplikaciju.";
        }

        vm.getUsers();
    }
})();
