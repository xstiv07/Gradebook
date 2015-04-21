angular.module('dashboardCtrl', ['ui.bootstrap'])

.controller('dashboardController', function (User, $routeParams) {
	var vm = this;

	vm.oneAtATime = false;
	vm.isCollapsed = true;
	vm.showTree = false;

	//assuming there will be only one submission allowed for an assignment
	User.getFullInfo(currentUserId).success(function (data) {
		vm.userData = data;
	});
})

.controller('cpanelController', function (Assignment, Class, $location, $route) {
	var vm = this;
	vm.processing = false;

	Class.getFullInfoForInstructor(currentUserId).success(function (data) {
		console.log(data)
		vm.instructorData = data;
	});

	vm.deleteClass = function (classId) {
		vm.processing = true;
		Class.delete(classId).success(function (data) {
			vm.processing = false;
			$route.reload();
		});
	};

	vm.deleteAssignment = function (assignmentId) {
		vm.processing = true;
		Assignment.delete(assignmentId).success(function (data) {
			vm.processing = false;
			$route.reload();
		});
	};
})