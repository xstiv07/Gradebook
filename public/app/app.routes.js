angular.module('app.routes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'app/views/pages/home.html'
		})
		.when('/dashboard',{
			templateUrl: 'app/views/pages/dashboard.html',
			controller: 'dashboardController',
			controllerAs: 'dashboard'
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
		.when('/classes/my',{
			templateUrl: 'app/views/pages/classes/my.html',
			controller: 'myClassController',
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
		.when('/assignments',{
			templateUrl: 'app/views/pages/assignments/all.html',
			controller: 'assignmentController',
			controllerAs: 'assignment'
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
		.when('/assignments/viewSubmissions/:assignment_id',{
			templateUrl: 'app/views/pages/submissions/all.html',
			controller: 'viewSubmissionController',
			controllerAs: 'assignment'
		})
		.otherwise({
            redirectTo: '/'
        });

	$locationProvider.html5Mode(true);
});