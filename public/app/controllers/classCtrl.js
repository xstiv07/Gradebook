angular.module('classCtrl', [])

.controller('classController', function ($rootScope, $location, Class) {
	var vm = this;
	vm.processing = true;

	vm.itemsPerPage = 3;
	vm.currentPage = 1;
	vm.maxSize = 5;

	Class.all().success(function (data) {
		
		vm.notFilteredClasses = data;
		vm.totalItems = data.length;

		var begin = ((vm.currentPage - 1) * vm.itemsPerPage),
		end = begin + vm.itemsPerPage;
		vm.classes = vm.notFilteredClasses.slice(begin, end);

		vm.processing = false;
	})
	.error(function (err) {
		vm.processing = true;
	})


	vm.pageChanged = function () {
		var begin = ((vm.currentPage - 1) * vm.itemsPerPage),
		end = begin + vm.itemsPerPage;
		vm.classes = vm.notFilteredClasses.slice(begin, end);
	}

	vm.pageCount = function () {
		return Math.ceil(vm.totalItems / vm.itemsPerPage)
	}

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
			vm.classData.instructor = currentUser.id;

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