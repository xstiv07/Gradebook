angular.module('classCtrl', ['classService'])

.controller('classController', function (Class) {
	var vm = this;

	vm.processing = true;

	Class.all().success(function (data) {
		vm.classes = data;
		vm.processing = false;
	})
})

.controller('addStudentsController', function ($routeParams, $location, User, Class) {
	var vm = this;

	vm.processing = true;
	vm.selectedUsers = [];

	//geting all users
	User.all().success(function (data) {
		vm.processing = false;
		vm.users = data;
	});

	vm.toggleCheck = function(usr) {
		if (vm.selectedUsers.indexOf(usr) === -1)
			vm.selectedUsers.push(usr)
		else
			vm.selectedUsers.splice(vm.selectedUsers.indexOf(usr), 1);
	};

	vm.postStudents = function () {
		Class.postStudents($routeParams.class_id, vm.selectedUsers).success(function (data) {
			vm.selectedUsers = [];
			$location.path('/classes/enrolledStudents/' + $routeParams.class_id);
		})
	}
})

.controller('enrolledStudentsController', function ($routeParams, Class) {
	var vm = this;

	vm.processing = true;

	Class.getStudents($routeParams.class_id).success(function (data) {
		vm.users = data;
		
		console.log(vm.users)
	})


})