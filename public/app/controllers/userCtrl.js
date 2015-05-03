angular.module('userCtrl', ['userService'])

.controller('userController', function (User, $location) {
	var vm = this;

	vm.processing = true;

	vm.itemsPerPage = 10;
	vm.currentPage = 1;
	vm.maxSize = 5;
	
	User.all().success(function (data) {
		vm.notFilteredUsers = data;
		vm.totalItems = data.length;

		var begin = ((vm.currentPage - 1) * vm.itemsPerPage),
		end = begin + vm.itemsPerPage;
		vm.users = vm.notFilteredUsers.slice(begin, end);

		vm.processing = false;
	}).error(function () {
		vm.processing = false;
	});

	vm.pageChanged = function () {
		var begin = ((vm.currentPage - 1) * vm.itemsPerPage),
		end = begin + vm.itemsPerPage;
		vm.users = vm.notFilteredUsers.slice(begin, end);
	}

	vm.deleteUser = function (id) {
		User.delete(id).success(function (data) {
			vm.processing = false;
			vm.users = data.users;
		});
	};

})

.controller('userEditController', function ($location, $routeParams, User) {
	var vm = this;
	vm.processing = true;


	User.get($routeParams.user_id).success(function (data) {
		vm.userData = data;
		vm.selectedRoles = data.roles;
		vm.processing = false;
	});

	vm.roles = ['Instructor', 'Admin'];

	vm.toggleCheck = function(role) {
		
		if (vm.selectedRoles.indexOf(role) === -1)
			vm.selectedRoles.push(role)
		else
			vm.selectedRoles.splice(vm.selectedRoles.indexOf(role), 1);
	};

	vm.postUserRoles = function () {
		vm.processing = true;
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
	};
})