angular.module('userService', [])

.factory('User', function ($http) {
	var userFactory = {};

	userFactory.all = function () {
		return $http.get('/api/users/');
	};

	userFactory.get = function (id) {
		return $http.get('/api/users/' + id);
	};

	userFactory.update = function (id, data) {
		return $http.put('/api/users/' + id, data);
	};

	userFactory.delete = function (id) {
		return $http.delete('/api/users/' + id);
	};

	return userFactory;
});