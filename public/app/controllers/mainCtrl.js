angular.module('mainCtrl', ['ui.bootstrap'])

.controller('mainController', function ($rootScope, $location, Auth, $modal) {
	var vm = this;
	isInstructor = false;
	isAdmin = false;

	//login modal handler
	vm.openLogin = function (size) {
		var modalInstance = $modal.open({
			templateUrl: "loginModal.html",
			controller: "loginModalController",
			controllerAs: "login",
			size: size
		});
	};

	//register modal handler
	vm.openRegister = function (size) {
		var modalInstance = $modal.open({
			templateUrl: "registerModal.html",
			controller: "registerModalController",
			controllerAs: "register",
			size: size
		});
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
				currentUserId = data.data.id;
			});
	});

	vm.doLogout = function () {
		Auth.logout();
		//reset all user info
		vm.user = {};
		$location.path('/login');
	};
})

.controller('loginModalController', function (Auth, $modalInstance, $location) {
	var vm = this;

	vm.close = function () {
		$modalInstance.dismiss('cancel');
	};

	vm.doLogin = function (isValid) {
		vm.processing = true;

		vm.error = '';

		if(isValid){

			Auth.login(vm.loginData).success(function (data) {
				vm.processing = false;
				// if a user successfully logs in, redirect to users page
					if (data.success){		
						$location.path('/dashboard');
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

.controller('registerModalController', function (Auth, $modalInstance, $location) {
	var vm = this;

	vm.close = function () {
		$modalInstance.dismiss('cancel');
	};

	vm.doRegister = function (isValid) {
		vm.error = '';
		console.log("in here")
		if(isValid){
			Auth.register(vm.registerData).success(function (data) {
				if (data.success){		
					$location.path('/dashboard');
					$modalInstance.dismiss('close');
				}
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
})