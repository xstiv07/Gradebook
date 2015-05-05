angular.module('assignmentService', [])

.factory('Assignment', function ($http) {
	var assignmentFactory = {};

	assignmentFactory.all = function () {
		return $http.get('/api/assignments/');
	};

	assignmentFactory.create = function (data, id) {
		return $http.post('/api/assignments/create/' + id, data);
	};

	assignmentFactory.allForClass = function (id) {
		return $http.get('/api/assignments/view/' + id);
	};

	assignmentFactory.delete = function (id) {
		return $http.delete('/api/assignments/' + id);
	};

	assignmentFactory.postAssignments = function (classId, assignmentIds) {
		return $http.post('/api/assignments/addExisting/' + classId, assignmentIds);
	};

	assignmentFactory.submit = function (assignmentId, files) {
		return $http.post('/api/assignments/submit/' + assignmentId, files)
	};

	assignmentFactory.setGradeOrComment = function (data) {
		return $http.post('/api/assignment/setGradeOrComment/', data)
	};

	assignmentFactory.getSubmissions = function (assignmentId) {
		return $http.get('/api/assignments/submit/' + assignmentId)
	};

	return assignmentFactory;
})