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
	'assignmentService',
	'dashboardCtrl',
	'submissionCtrl',
	'angularFileUpload',
	"customDirectives",
	'ui.bootstrap',
	'ui.calendar'
	])

.config(function($httpProvider) {
	// attach auth interceptor to http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});