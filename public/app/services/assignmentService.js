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

	assignmentFactory.deleteFromClass = function (classId, assignmentId) {
		return $http.put('/api/assignments/view/' + classId, assignmentId)
	};

	assignmentFactory.postAssignments = function (classId, assignmentIds) {
		return $http.post('/api/assignments/addExisting/' + classId, assignmentIds);
	}

	assignmentFactory.submit = function (assignmentId, userId, files) {
		return $http.post('/api/assignments/submit' + assignmentId, userId, files)
	}

	return assignmentFactory;
})