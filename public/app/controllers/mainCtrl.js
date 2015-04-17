angular.module('mainCtrl', ['ui.bootstrap'])

.controller('mainController', function ($rootScope, $location, Auth, $modal) {
	var vm = this;
	isInstructor = false;
	isAdmin = false;


	vm.openLogin = function (size) {
		var modalInstance = $modal.open({
			templateUrl: "loginModal.html",
			controller: "loginModalController",
			controllerAs: "login",
			size: size
		})
	};

	//get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	//check to see if a user is logged in on every request
	$rootScope.$on('$locationChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();
		// get user information on page load
		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
				isInstructor = vm.isInstructor = data.data.roles.indexOf('Instructor') != -1;
				isAdmin = vm.isAdmin = data.data.roles.indexOf('Admin') != -1;
			});
	});

	vm.doRegister = function (isValid) {
		// clear the error
		vm.error = '';

		if(isValid){
			Auth.register(vm.registerData).success(function (data) {
				if (data.success)			
					$location.path('/users');
				else{
					vm.processing = false;
					vm.error = data.message;
				}

			})
		}else{
			vm.processing = false;
			vm.error = 'Fields marked with a * are mandatory.';
		}	
	};

	vm.doLogout = function () {
		Auth.logout();
		//reset all user info
		vm.user = {};
		$location.path('/login');
	};
})

.controller('loginModalController', function (Auth, $modalInstance, $location) {
	var vm = this;

	vm.doLogin = function (isValid) {
		console.log('in doLogin')
		vm.processing = true;

		// clear the error
		vm.error = '';

		if(isValid){

			Auth.login(vm.loginData).success(function (data) {
				vm.processing = false;
				// if a user successfully logs in, redirect to users page
					if (data.success){		
						$location.path('/users');
						$modalInstance.dismiss('cancel');
					}
					else 
						vm.error = data.message;
			});
		}else{
			vm.processing = false;
			vm.error = 'Fields marked with a * are mandatory.';
		}
	};
})