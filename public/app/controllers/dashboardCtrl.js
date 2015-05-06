angular.module('dashboardCtrl', [])

.controller('dashboardController', function (User, $routeParams, $rootScope) {
	var vm = this;

	vm.isCollapsed = false;
	vm.showTree = false;

	// ---------------calendar---------------
	vm.eventSources = [];

	$rootScope.deferredRounting.promise.then(function () {
			User.getCalendarInfo($rootScope.currentUser.id).success(function (data) {
				vm.eventSources.push(data);
			})
		});

	vm.uiConfig = {
		calendar:{
			height: 500,
			editable: false,
			eventBorderColor: '#fff',
			eventAfterRender: function (event, element, view) {
		        var today = new Date();
		        if (event.start < today && event.end > today) {
		        	//in progress
		            element.css('background-color', '#1BBC9B');
		        } else if (event.start < today && event.end < today) {
		            //past event
		            element.css('background-color', 'red');
		        } else if (event.start > today && event.end > today) {
		            //future event, hasn't started yet
		            element.css('background-color', '#AEC6CF');
		        }
		    }
		}
	}

	// ------------------------------------------

	$rootScope.deferredRounting.promise.then(function () {
		vm.isInstructor = $rootScope.currentUser.isInstructor;
	});
})

.controller('cpanelController', function (Assignment, Class, $location, $route, $modal, $rootScope) {
	var vm = this;
	vm.processing = false;
	vm.isOpen = false;

	$rootScope.deferredRounting.promise.then(function () {
		Class.getFullInfoForInstructor($rootScope.currentUser.id).success(function (data) {
			vm.instructorData = data;
		});
	});

	vm.areYouSure = function (id) {
		var modalInstance = $modal.open({
			animation: vm.animationsEnabled,
			templateUrl: 'areYouSure.html',
			controller: "areYouSureController",
			controllerAs: "assignment",
		});
		modalInstance.result.then(function () {
			vm.deleteAssignment(id)
		});
	};

	vm.areYouSureDeleteClass = function (id) {
		var modalInstance = $modal.open({
			animation: vm.animationsEnabled,
			templateUrl: 'areYouSureDeleteClass.html',
			controller: "areYouSureController",
			controllerAs: "class",
		});
		modalInstance.result.then(function () {
			vm.deleteClass(id)
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