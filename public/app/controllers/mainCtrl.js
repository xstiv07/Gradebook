angular.module('mainCtrl', ['ui.bootstrap'])

.controller('mainController', function ($rootScope, $location, Auth, $modal) {
	var vm = this;


	//login modal handler
	vm.openLogin = function () {
		var modalInstance = $modal.open({
			templateUrl: "loginModal.html",
			controller: "loginModalController",
			controllerAs: "login"
		});
	};

	//register modal handler
	vm.openRegister = function () {
		var modalInstance = $modal.open({
			templateUrl: "registerModal.html",
			controller: "registerModalController",
			controllerAs: "register"
		});
	};

	$rootScope.deferredRounting.promise.then(function () {
		vm.user = $rootScope.currentUser;
		vm.isAdmin = vm.user.isAdmin;
		vm.isInstructor = vm.user.isInstructor;
	})

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
		console.log(vm.loginData)
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
			vm.error = 'Invalid form';
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
			vm.error = 'Invalid form';
		}	
	};
})