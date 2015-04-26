angular.module('classCtrl', [])

.controller('classController', function ($rootScope, $location, Class) {
	var vm = this;
	vm.processing = true;

	Class.all().success(function (data) {
		vm.classes = data;
		vm.processing = false;
	});

	vm.doDeleteClass = function (id) {
		vm.processing = true;
		Class.delete(id).success(function (data) {
			vm.processing = false;
			vm.classes = data.classes;
		});
	};

	vm.doNewClass = function (isValid) {
		vm.error = '';
		vm.processing = true;

		if (isValid){
			vm.classData.instructor = currentUserId;

			Class.create(vm.classData).success(function (data) {
				if(data.success)
					$location.path('/cpanel');
				else
					vm.error = data.message;
				vm.processing = false;
			});
		}else{
			vm.processing = false;
			vm.error = 'Fields marked with a * are mandatory.';
		};
	};
})

.controller('addStudentsController', function ($routeParams, $location, User, Class) {
	var vm = this;

	vm.processing = true;
	vm.selectedUsers = [];

	//geting all users who are not instructors
	User.all().success(function (data) {
		vm.users = data;
		vm.processing = false;
	});

	vm.toggleCheck = function(usr) {
		vm.processing = true;
		if (vm.selectedUsers.indexOf(usr) === -1)
			vm.selectedUsers.push(usr)
		else
			vm.selectedUsers.splice(vm.selectedUsers.indexOf(usr), 1);
		vm.processing = false;
	};

	vm.postStudents = function () {
		vm.processing = true;
		Class.postStudents($routeParams.class_id, vm.selectedUsers).success(function (data) {
			if (data.success)			
				$location.path('/classes/enrolledStudents/' + $routeParams.class_id);
			vm.processing = false;
		});
	};
})

.controller('enrolledStudentsController', function ($location, $routeParams, Class, $modalInstance, classId) {
	var vm = this;
	vm.processing = true;

	Class.getStudents(classId).success(function (data) {
		vm.users = data.students;
		vm.className = data.className;
		vm.processing = false;
	});

	vm.close = function () {
		$modalInstance.dismiss('cancel');
	};

	vm.unenroll = function (userId) {
		vm.processing = true;
		var usrId = {
			userId : userId
		};
		Class.unenroll(classId, usrId).success(function (data) {
			vm.users = data
			vm.processing = false;
		});
	};

})