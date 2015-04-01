angular.module('mainCtrl', [])

.controller('mainController', function ($rootScope, $location, Auth) {
	var vm = this;

	//get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	//check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();
		// get user information on page load
		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
			});
	});	

	vm.doRegister = function (isValid) {

		// clear the error
		vm.error = '';

		if(isValid){
			var registerData = {
				name: vm.registerData.name,
				username: vm.registerData.username,
				password: vm.registerData.password
			};

			Auth.register(registerData).success(function (data) {
				if (data.success)			
					$location.path('/users');
				else 
					vm.error = data.message;

			})
		}else{
			vm.processing = false;
			vm.error = 'Fill out all the required info.';
		}	
	};

	vm.doLogin = function (isValid) {
		vm.processing = true;

		// clear the error
		vm.error = '';

		if(isValid){
				var loginData = {
				username: vm.loginData.username,
				password: vm.loginData.password
			};

			Auth.login(loginData).success(function (data) {
				vm.processing = false;
				// if a user successfully logs in, redirect to users page
					if (data.success)			
						$location.path('/users');
					else 
						vm.error = data.message;
			});
		}else{
			vm.processing = false;
			vm.error = 'Fill out all the required info.';
		}
	};

	vm.doLogout = function () {
		Auth.logout();
		//reset all user info
		vm.user = {};
		$location.path('/login');
	};
});