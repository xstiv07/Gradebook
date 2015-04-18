angular.module('classCtrl', ['classService'])

.controller('classController', function ($location, Class) {
	var vm = this;
	vm.processing = true;

	vm.isInstructor = isInstructor;

	Class.all().success(function (data) {
		vm.classes = data;
		vm.processing = false;
	});

	vm.doDeleteClass = function (id) {
		Class.delete(id).success(function (data) {
			vm.processing = false;
			vm.classes = data.classes;
		});
	};

	vm.doNewClass = function (isValid) {
		vm.error = '';
		if (isValid){
			Class.create(vm.classData).success(function (data) {
				if(data.success)
					$location.path('/classes');
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

.controller('addStudentsController', function ($routeParams, $location, User, Class) {
	var vm = this;
	vm.isInstructor = isInstructor;

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
			if (data.success)			
				$location.path('/classes/enrolledStudents/' + $routeParams.class_id);
				
			vm.processing = false;
		});
	};
})

.controller('myClassController', function (User) {
	var vm = this;

	vm.isCollapsed = false;

	User.get(currentUserId).success(function (data) {
		vm.userData = data;
	})
})

.controller('enrolledStudentsController', function ($location, $routeParams, Class) {
	var vm = this;
	vm.isInstructor = isInstructor;

	vm.processing = true;

	Class.getStudents($routeParams.class_id).success(function (data) {
		vm.users = data.students;
		vm.className = data.className;
		vm.processing = false;
	});

	vm.unenroll = function (userId) {
		var usrId = {
			userId : userId
		};
		Class.unenroll($routeParams.class_id, usrId).success(function () {
			Class.getStudents($routeParams.class_id).success(function (data) {
				vm.users = data.students;
				vm.processing = false;
			});
		})
	};

})