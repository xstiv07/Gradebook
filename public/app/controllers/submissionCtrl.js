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
	vm.processing = true;

	vm.receivedComment = false;
	vm.receivedGrade = false;

	vm.itemsPerPage = 1;
	vm.currentPage = 1;
	vm.maxSize = 5;

	//get all submissions for the assignment
	Assignment.getSubmissions(assignmentId).success(function (data) {
		vm.notFilteredSubmissions = data.submissions;
		vm.totalItems = data.submissions.length;

		var begin = ((vm.currentPage - 1) * vm.itemsPerPage),
		end = begin + vm.itemsPerPage;
		vm.submissions = vm.notFilteredSubmissions.slice(begin, end);

		vm.assignmentName = data.assignmentName;
		vm.processing = false;
	});


	vm.pageChanged = function () {
		var begin = ((vm.currentPage - 1) * vm.itemsPerPage),
		end = begin + vm.itemsPerPage;
		vm.submissions = vm.notFilteredSubmissions.slice(begin, end);
	};


	vm.postGrade = function (isValid, grade, submissionId) {
		vm.error = '';

		if(isValid){
			var data = {
				gradeToSet: grade,
				assignmentId: assignmentId,
				submissionId: submissionId
			};
			Assignment.setGradeOrComment(data).success(function (data) {
				vm.receivedGrade = true;
				vm.processing = false;
			});
		}else{
			vm.error = 'Invalid form';
		};
	};

	vm.close = function () {
		$modalInstance.dismiss('cancel');
	};

	vm.postComment = function (isValid, commment, submissionId) {
		if(isValid){
			var data = {
				commentToSet: commment,
				assignmentId: assignmentId,
				submissionId: submissionId
			};
			Assignment.setGradeOrComment(data).success(function (data) {
				vm.receivedComment = true;
			});
		};
	};
})