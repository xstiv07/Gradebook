angular.module('dashboardCtrl', [])

.controller('dashboardController', function (User, $routeParams, $rootScope) {
	var vm = this;

	vm.oneAtATime = false;
	vm.isCollapsed = true;
	vm.showTree = false;

	$rootScope.deferredRounting.promise.then(function () {
		vm.isInstructor = $rootScope.currentUser.isInstructor;
		console.log('resolved')
	});
})

.controller('cpanelController', function (Assignment, Class, $location, $route, $modal, $rootScope) {
	var vm = this;
	vm.processing = false;

	$rootScope.deferredRounting.promise.then(function () {
		Class.getFullInfoForInstructor($rootScope.currentUser.id).success(function (data) {
			vm.instructorData = data;
		});
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

.controller('areYouSureController', function ($modalInstance) {
	vm = this;

	vm.ok = function () {
		$modalInstance.close();
	};

	vm.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
})