angular.module('rolesCtrl', [])

.controller('rolesController', function (Role, $location) {
	var vm = this;
	vm.processing = true;

	Role.all().success(function (data) {
		vm.roles = data;
		vm.processing = false;
	});

	vm.newRole = function (isValid) {
		if (isValid){
			Role.create(vm.roleData).success(function (data) {
				if (data.success)
					$location.path('/roles')
				else{
					vm.processing = false;
					vm.error = data.message;
				};
			})
		}else{
			vm.processing = false;
			vm.error = 'Fields marked with a * are mandatory.';
		};
	}
})