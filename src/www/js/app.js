var routerApp = angular.module('routerApp', ['ui.router', 'ui.bootstrap', 'lr.upload']);

routerApp.$inject = ['AppController'];

// ROUTER
routerApp.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/login');
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'app/pages/home.html',
			controller: 'AppController as vm'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'app/pages/login.html',
			controller: 'LoginController as vm'
		})
});

// LOGIN CONTROLLER
routerApp.controller('LoginController', function ($rootScope, $scope, $http, $state) {
	var vm = this;

	vm.username = '';
	vm.password = '';
	vm.message = '';

	vm.login = function () {
		$http.get('/api/login?username=' + vm.username + '&password=' + vm.password).then(
			function () {

				$state.go('home');
			}, function () {
				vm.message = err;
			});
	}

});

// REGISTER CONTROLLER
routerApp.controller('RegisterController', function ($rootScope, $scope, $http, $state) {
	var vm = this;

	vm.username = '';
	vm.password = '';
	vm.message = '';

	vm.register = function () {
		$http.get('/api/login?username=' + vm.username + '&password=' + vm.password).then(

		)
	}
});
