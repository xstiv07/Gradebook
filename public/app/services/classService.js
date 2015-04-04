angular.module('classService', [])

.factory('Class', function ($http) {
	var classFactory = {};

	classFactory.all = function () {
		return $http.get('/api/classes/');
	};

	classFactory.create = function (classData) {
		return $http.post('/api/classes/', classData);
	};

	classFactory.delete = function (id) {
		return $http.delete('/api/classes/' + id);
	};

	classFactory.postStudents = function (id, studentsIds) {
		return $http.post('/api/classes/addStudents/' + id, studentsIds);
	};

	classFactory.getStudents = function (id) {
		return $http.get('/api/classes/enrolledStudents/' + id);
	};

	return classFactory;
})