angular.module('roleService', [])

.factory('Role', function ($http) {
	var roleFactory = {};

	roleFactory.all = function () {
		return $http.get('/api/roles');
	};

	roleFactory.create = function (data) {
		return $http.post('/api/roles/', data)
	}

	return roleFactory;
});