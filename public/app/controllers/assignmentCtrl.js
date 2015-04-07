angular.module('assignmentCtrl', ['assignmentService'])

.controller('assignmentController', function ($location, $routeParams, Assignment) {
	var vm = this;

	vm.processing = true;

	Assignment.all().success(function (data) {
		vm.assignments = data;
		vm.processing = false;
	});

	vm.doDeleteAssignment = function (id) {
		console.log('in delete')
		Assignment.delete(id).success(function (data) {
			vm.processing = false;
			vm.assignments = data.assignments;
		});
	}

	vm.doNewAssignment = function (isValid) {
		vm.error = '';
		if (isValid){
			Assignment.create(vm.assignmentData, $routeParams.class_id).success(function (data) {
				if (data.success)
					$location.path('/assignments/view/' + $routeParams.class_id)
				else{
					vm.processing = false;
					vm.error = data.message;
				}
			})
		}else{
			vm.processing = false;
			vm.error = 'Fields marked with a * are mandatory.';
		}
	}
})
.controller('assignmentClassController', function ($routeParams, Assignment) {
	var vm = this;

	vm.processing = true;

	vm.doDeleteAssignment = function (id) {
		Assignment.delete(id).success(function (data) {
			vm.processing = false;
			vm.assignments = data.assignments;
		});
	};

	Assignment.allForClass($routeParams.class_id).success(function (data) {
		vm.assignments = data.assignments;
		vm.processing = false;
	})
})