angular.module('userCtrl', ['userService'])

.controller('userController', function (User, $location, $modal) {
	var vm = this;

	vm.processing = true;

	vm.itemsPerPage = 3;
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

	vm.areYouSure = function (id) {
		var modalInstance = $modal.open({
			animation: vm.animationsEnabled,
			templateUrl: 'areYouSure.html',
			controller: "areYouSureController",
			controllerAs: "user",
		});
		modalInstance.result.then(function () {
			vm.deleteUser(id)
		});
	};

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

	vm.receivedData = false;


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
			vm.receivedData = true;
			vm.message = data.message;
				
			vm.processing = false;
		});
	};

	vm.saveUser = function () {
		vm.processing = true;

		User.update($routeParams.user_id, vm.userData).success(function (data) {
		
			vm.receivedData = true;
			vm.message = data.message;
			vm.processing = false;
		});
	};
})