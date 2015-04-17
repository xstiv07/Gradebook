angular.module('userCtrl', ['userService'])

.controller('userController', function (User) {
	var vm = this;
	vm.isInstructor = isInstructor;
	vm.isAdmin = isAdmin;

	vm.processing = true;

	User.all().success(function (data) {
		vm.processing = false;
		vm.users = data;
	})

	vm.deleteUser = function (id) {
		User.delete(id).success(function (data) {
			vm.processing = false;
			vm.users = data.users
		})
	}
})

.controller('userEditController', function ($location, $routeParams, User) {
	var vm = this;

	User.get($routeParams.user_id).success(function (data) {
		vm.userData = data;
		vm.selectedRoles = data.roles;
	});

	vm.roles = ['Admin', 'Instructor']

	vm.toggleCheck = function(role) {
		
		if (vm.selectedRoles.indexOf(role) === -1)
			vm.selectedRoles.push(role)
		else
			vm.selectedRoles.splice(vm.selectedRoles.indexOf(role), 1);
	};

	vm.postUserRoles = function () {
		User.postUserRoles($routeParams.user_id, vm.selectedRoles).success(function (data) {
			if (data.success)			
				$location.path('/users');
				
			vm.processing = false;
		});
	};


	vm.saveUser = function () {
		vm.processing = true;

		User.update($routeParams.user_id, vm.userData).success(function (data) {

			if (data.success)			
					$location.path('/users');
				else 
					vm.message = data.message;
			vm.processing = false;
		});
	}
})