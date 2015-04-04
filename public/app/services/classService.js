angular.module('classService', [])

.factory('Class', function ($http) {
	var classFactory = {};

	classFactory.all = function () {
		return $http.get('/api/classes/');
	};

	classFactory.postStudents = function (id, studentsIds) {
		return $http.post('/api/classes/addStudents/' + id, studentsIds);
	}

	classFactory.getStudents = function (id) {
		return $http.get('/api/classes/enrolledStudents/' + id);
	}

	return classFactory;
})