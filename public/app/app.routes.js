angular.module('app.routes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'app/views/pages/home.html'
		})
		.when('/dashboard',{
			templateUrl: 'app/views/pages/dashboard.html',
			controller: 'dashboardController',
			controllerAs: 'dash'
		})
		.when('/cpanel',{
			templateUrl: 'app/views/pages/cpanel.html',
			controller: 'cpanelController',
			controllerAs: 'cpanel'
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
		.when('/classes/create',{
			templateUrl: 'app/views/pages/classes/create.html',
			controller: 'classController',
			controllerAs: 'class'
		})
		.when('/classes/addStudents/:class_id', {
			templateUrl: 'app/views/pages/classes/addStudents.html',
			controller: 'addStudentsController',
			controllerAs: 'addStudents'
		})
		.when('/assignments',{
			templateUrl: 'app/views/pages/assignments/all.html',
			controller: 'assignmentController',
			controllerAs: 'assignment'
		})
		.when('/grades',{
			templateUrl: 'app/views/pages/assignments/grades.html',
			controller: 'gradesController',
			controllerAs: 'grade'
		})
		.when('/assignments/create/:class_id',{
			templateUrl: 'app/views/pages/assignments/create.html',
			controller: 'assignmentController',
			controllerAs: 'assignment'
		})
		.when('/assignments/view/:class_id',{
			templateUrl: 'app/views/pages/assignments/classAssignments.html',
			controller: 'assignmentClassController',
			controllerAs: 'assignment'
		})
		.when('/assignments/addAssignment/:class_id',{
			templateUrl: 'app/views/pages/assignments/addExistingAssignment.html',
			controller: 'assignmentController',
			controllerAs: 'assignment'
		})
		.when('/assignments/submit/:assignment_id',{
			templateUrl: 'app/views/pages/assignments/submit.html',
			controller: 'submissionController',
			controllerAs: 'submission'
		})
		.otherwise({
            redirectTo: '/'
        });

	$locationProvider.html5Mode(true);
});