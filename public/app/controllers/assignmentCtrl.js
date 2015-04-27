angular.module('assignmentCtrl', ['assignmentService', 'ui.bootstrap'])

.controller('assignmentController', function ($location, $routeParams, Assignment) {
	var vm = this;

	vm.processing = true;

	Assignment.all().success(function (data) {
		vm.assignments = data;
		vm.processing = false;
	});

	vm.selectedAssignments = [];


	// -----------------Datepicker----------------------//
	vm.today = function() {
	    vm.dt = new Date();
  	};
  	vm.today();

  	vm.clear = function () {
  		$vm.dt = null;
	 };

	// Disable weekend selection
	vm.disabled = function(date, mode) {
		return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	};

	vm.toggleMin = function() {
		vm.minDate = vm.minDate ? null : new Date();
	};

	vm.toggleMin();

	vm.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		vm.opened = true;
	};

	vm.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	vm.format = vm.formats[0];

	//---------------------------------------------------------

	vm.toggleCheck = function (assignm) {
		if(vm.selectedAssignments.indexOf(assignm) === -1)
			vm.selectedAssignments.push(assignm);
		else
			vm.selectedAssignments.splice(vm.selectedAssignments.indexOf(assignm), 1);
	};

	vm.postAssignments = function () {
		Assignment.postAssignments($routeParams.class_id, vm.selectedAssignments).success(function (data) {
			if(data.success)
				$location.path('/assignments/view/' + $routeParams.class_id);
			vm.processing = false;
		})
	}

	vm.doDeleteAssignment = function (id) {
		console.log('in delete')
		Assignment.delete(id).success(function (data) {
			vm.processing = false;
			vm.assignments = data.assignments;
		});
	};

	vm.doNewAssignment = function (isValid) {
		vm.error = '';
		if (isValid){
			Assignment.create(vm.assignmentData, $routeParams.class_id).success(function (data) {
				if (data.success)
					$location.path('/cpanel')
				else{
					vm.processing = false;
					vm.error = data.message;
				};
			});
		}else{
			vm.processing = false;
			vm.error = 'Fields marked with a * are mandatory.';
		};
	};
})

.controller('gradesController', function ($routeParams, User) {
	var vm = this;
	vm.oneAtATime = false;

	vm.statusText = 'Not Submitted';

	vm.showStatus = function () {
		vm.statusText = 'Submit'
	};

	//assuming there will be only one submission allowed for an assignment
	User.getFullInfo(currentUser.id).success(function (data) {
		vm.userData = data;
	});
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

	vm.deleteAssignmentFromClass = function (assignmentId) {
		var assignmId = {
			assignmentId: assignmentId
		};

		Assignment.deleteFromClass($routeParams.class_id, assignmId).success(function () {
			Assignment.allForClass($routeParams.class_id).success(function (data) {
				vm.assignments = data.assignments;
				vm.processing = false;
			});
		});
	};

	Assignment.allForClass($routeParams.class_id).success(function (data) {
		vm.assignments = data.assignments;
		vm.classNm = data.classNm;
		console.log(vm.classNm);
		vm.processing = false;
	});
})