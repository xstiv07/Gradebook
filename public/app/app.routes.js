angular.module('app.routes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'app/views/pages/home.html'
		})
		.when('/login',{
			templateUrl: 'app/views/pages/login.html',
			controller: 'mainController',
			controllerAs: 'login'
		})
		.when('/register',{
			templateUrl: 'app/views/pages/register.html',
			controller: 'mainController',
			controllerAs: 'register'
		})
		.when('/users',{
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})
		.when('/users/:user_id',{
			templateUrl: 'app/views/pages/users/edit.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})
		.when('/classes',{
			templateUrl: 'app/views/pages/classes/all.html',
			controller: 'classController',
			controllerAs: 'class'
		})
		.when('/classes/addStudents/:class_id', {
			templateUrl: 'app/views/pages/classes/addStudents.html',
			controller: 'addStudentsController',
			controllerAs: 'addStudents'
		})
		.when('/classes/enrolledStudents/:class_id',{
			templateUrl: 'app/views/pages/classes/enrolledStudents.html',
			controller: 'enrolledStudentsController',
			controllerAs: 'enrolledStudents'
		})

	$locationProvider.html5Mode(true);
});