angular.module('gradebookApp', 
	['ngAnimate',
	'app.routes',
	'authService',
	'mainCtrl',
	'userCtrl',
	'userService',
	'classCtrl',
	'classService',
	'assignmentCtrl',
	'assignmentService']
	)

.config(function($httpProvider) {

	// attach auth interceptor to http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});