angular.module('userService', [])

.factory('User', function ($http) {
	var userFactory = {};

	userFactory.all = function () {
		return $http.get('/api/users/');
	};

	userFactory.get = function (id) {
		return $http.get('/api/users/' + id);
	};

	userFactory.getFullInfo = function (id) {
		return $http.get('/api/users/fullInfo/' + id)
	};
	userFactory.getCalendarInfo = function (userId) {
		return $http.get('/api/calendarInfo/' + userId)
	}

	userFactory.update = function (id, data) {
		return $http.put('/api/users/' + id, data);
	};

	userFactory.delete = function (id) {
		return $http.delete('/api/users/' + id);
	};

	userFactory.postUserRoles = function (id, roles) {
		return $http.post('/api/users/setRole/' + id, roles)
	};

	return userFactory;
});