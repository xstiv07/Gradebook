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
				vm.processing = false;
		});
		};
	};
})
.controller('viewSubmissionController', function ($routeParams, Assignment, $location, $modalInstance, assignmentId) {
	var vm = this;

	//get all submissions for the assignment
	Assignment.getSubmissions(assignmentId).success(function (data) {
		vm.submissions = data.submissions;
		vm.assignmentName = data.assignmentName;
	});

	vm.postGrade = function (isValid, grade, submissionId) {
		vm.error = '';

		if(isValid){
			var data = {
				gradeToSet: grade,
				submissionId: submissionId
			};
			Assignment.setGradeOrComment(data).success(function (data) {
				$location.path('/assignments/viewSubmissions/' + $routeParams.assignment_id);
			});
		}else{
			vm.processing = false;
			vm.error = 'Fields marked with a * are mandatory.';
		};
	};

	vm.close = function () {
		$modalInstance.dismiss('cancel');
	};

	vm.postComment = function (isValid, commment, submissionId) {
		if(isValid){
			var data = {
				commentToSet: commment,
				submissionId: submissionId
			};
			Assignment.setGradeOrComment(data).success(function (data) {
				console.log(data)
			});
		};
	};
})