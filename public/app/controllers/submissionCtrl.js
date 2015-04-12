angular.module('submissionCtrl', ['assignmentService', 'angularFileUpload'])

.controller('submissionController', function (Auth, Assignment, $routeParams, $upload) {
	var vm = this;
	vm.processing = true;

	Auth.getUser().then(function (user) {
		vm.currentUser = user.data
	});

	
	vm.error = '';
	vm.uploaded = false;

	vm.upload = function (files) {
		if (files && files.length) {
			$upload.upload({
				url: '/api/assignments/submit/' + $routeParams.assignment_id,
				data: vm.currentUser.id,
				file: files
			}).progress(function (e) {
				vm.uploadPercent  =  parseInt(100.0 * e.loaded / e.total) + ' %'
			}).success(function (data ,status, headers, config) {
				vm.uploaded = true;
		});
		};
	};
})
.controller('viewSubmissionController', function ($routeParams, Assignment) {
	var vm = this;

	//get all submissions for the assignment
	Assignment.getSubmissions($routeParams.assignment_id).success(function (data) {
		vm.submissions = data.submissions;
	});
})
.controller('viewSubmissionFilesController', function ($routeParams, Assignment) {
	var vm= this;

	Assignment.getSubmissionFiles($routeParams.submission_id).success(function (data) {
		vm.files = data.files;
	});
})