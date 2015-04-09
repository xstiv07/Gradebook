angular.module('submissionCtrl', ['assignmentService'])

.controller('submissionController', function (Auth, Assignment, $routeParams) {
	var vm = this;
	vm.processing = true;

	Auth.getUser().then(function (user) {
		vm.currentUser = user.data
	});

	vm.submit = function () {
		vm.error = '';

		var currentUserId = {
			userId: vm.currentUser.id
		}

		console.log($routeParams.assignment_id);
		console.log(currentUserId);

		//get form data --files to send to the api
		console.log(vm.userSubmission)


			// Assignment.submit($routeParams.assignment_id, currentUser, vm.files).success(function () {
			// 	$location.path('/');
			// 	vm.processing = false;
			// })
	}
})