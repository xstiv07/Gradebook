angular.module('dashboardCtrl', ['ui.bootstrap'])

.controller('dashboardController', function (User, $routeParams) {
	var vm = this;

	vm.oneAtATime = false;
	vm.isCollapsed = true;
	vm.showTree = false;

	//assuming there will be only one submission allowed for an assignment
	User.getFullInfo(currentUser.id).success(function (data) {
		vm.userData = data;
	});
})

.controller('cpanelController', function (Assignment, Class, $location, $route, $modal) {
	var vm = this;
	vm.processing = false;

	Class.getFullInfoForInstructor(currentUser.id).success(function (data) {
		vm.instructorData = data;
	});

	vm.openEnrolledStudents = function (size, id) {
		var modalInstance = $modal.open({
			templateUrl: "enrolledStudentsModal.html",
			controller: "enrolledStudentsController",
			controllerAs: "enrolledStudents",
			size: size,
			resolve:{
				classId: function () {
					return id;
				}
			}
		});
	};

	vm.openViewSubmissions = function (size, id) {
		var modalInstance = $modal.open({
			templateUrl: "viewSubmissionsModal.html",
			controller: "viewSubmissionController",
			controllerAs: "assignment",
			size: size,
			resolve:{
				assignmentId: function () {
					return id;
				}
			}
		});
	};

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