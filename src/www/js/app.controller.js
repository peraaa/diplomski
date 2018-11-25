(function () {
    'use strict';

    var app = angular.module('myApp', ['ui.bootstrap', 'angularFileUpload']);
    app.controller('AppCtrl', AppController);

    // AppController.$inject = ['$rootScope', '$scope', '$http'];
    function AppController($rootScope, $scope, $http, FileUploader ) {
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
            // if(vm.password == '1234' && vm.username =='djordje'){
            //     vm.message = "Prijavljen je korisnik: "+vm.username;
            //     vm.autorizovan = true;
            // }
            //     else if(vm.password == '4321' && vm.username =='petar')
            //     {
            //         vm.message = "Prijavljen je korisnik: "+vm.username;
            //         vm.autorizovan = true;
            //     }
            //   else
            //   {
            //     vm.message = "Pogresno korisnicko ime i/ili lozinka!";
            //   }
               if(vm.password == '' || vm.username == '')
                 {
                    vm.message = "Morate uneti korisnicko ime i sifru!";
                 }
            $http(req).then(function(resp){
                console.log(resp)
                if(resp.data.res == 'success'){
                    vm.autorizovan = true;
                }
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

        /******************************************** */
        vm.uploader = $scope.uploader = new FileUploader({ url: '/api/files/upload/' });

        // a sync filter
        vm.uploader.filters.push({
            name: 'syncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter');
                return this.queue.length < 10;
            }
        });

        // an async filter
        vm.uploader.filters.push({
            name: 'asyncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });

        // CALLBACKS

        vm.uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        vm.uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        vm.uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        vm.uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        vm.uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        vm.uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        vm.uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        vm.uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            var fileName = fileItem._file.name;
            var d = {
                'file': fileName
                }
            console.log(d);
        };
        vm.uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
            //vm.init();
        };
        /******************************************** */




        vm.getUsers();
    }
})();
