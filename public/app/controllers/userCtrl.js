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
	vm.selectedRoles = [];

	User.get($routeParams.user_id).success(function (data) {
		vm.userData = data;
	});

	vm.roles = ['Admin', 'Instructor']

	vm.removeRole = function (role) {
		var roleName = {
			role: role
		};
		User.removeRole($routeParams.user_id, roleName).success(function (data) {
			if (data.success)
				$location.path('/users');
			vm.processing = false;
		})
	}

	vm.toggleCheck = function(role) {
		
		if (vm.selectedRoles.indexOf(role) === -1){
			vm.selectedRoles.push(role)
			console.log(vm.selectedRoles)
		}
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