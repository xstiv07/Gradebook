angular.module('app.routes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {
	$routeProvider
		// -----------------main-routes----------------
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
		.when('/grades',{
			templateUrl: 'app/views/pages/assignments/grades.html',
			controller: 'gradesController',
			controllerAs: 'grade'
		})
		// ------------user-routes---------------
		.when('/users',{
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user',
			adminAccess: true
		})
		.when('/users/:user_id',{
			templateUrl: 'app/views/pages/users/edit.html',
			controller: 'userEditController',
			controllerAs: 'user',
			adminAccess: true
		})
		// ------------class-routes---------------
		.when('/classes',{
			templateUrl: 'app/views/pages/classes/all.html',
			controller: 'classController',
			controllerAs: 'class',
			adminAccess: true
		})
		.when('/classes/create',{
			templateUrl: 'app/views/pages/classes/create.html',
			controller: 'classController',
			controllerAs: 'class',
			instructorAccess: true,
			adminAccess: true
		})
		.when('/classes/addStudents/:class_id', {
			templateUrl: 'app/views/pages/classes/addStudents.html',
			controller: 'addStudentsController',
			controllerAs: 'addStudents',
			instructorAccess: true,
			adminAccess: true
		})
		// ------------assignment-routes---------------
		.when('/assignments',{
			templateUrl: 'app/views/pages/assignments/all.html',
			controller: 'assignmentController',
			controllerAs: 'assignment',
			adminAccess: true
		})
		.when('/assignments/create/:class_id',{
			templateUrl: 'app/views/pages/assignments/create.html',
			controller: 'assignmentController',
			controllerAs: 'assignment',
			adminAccess: true,
			instructorAccess: true
		})
		.when('/assignments/view/:class_id',{
			templateUrl: 'app/views/pages/assignments/classAssignments.html',
			controller: 'assignmentClassController',
			controllerAs: 'assignment',
			adminAccess: true
		})
		.when('/assignments/addAssignment/:class_id',{
			templateUrl: 'app/views/pages/assignments/addExistingAssignment.html',
			controller: 'assignmentController',
			controllerAs: 'assignment',
			instructorAccess: true,
			adminAccess: true
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
})

//checking for a user role on every request, based on the custom route parameters
// when done - returning a promise, so main ctrl can execute. 
.run(function ($rootScope, $location, $route, Auth, $q) {
	console.log('executing run')
	
	var adminRoutes = [];
	var instructorRoutes = [];

	$rootScope.deferredRounting = $q.defer();

	angular.forEach($route.routes, function (route, path) {
		if (route.adminAccess)
			adminRoutes.push(path);

		if (route.instructorAccess)
			instructorRoutes.push(path);
	});

	$rootScope.$on('$routeChangeStart', function (e, nextLocation, currentLocation) {
		var trigger = false; //used to control redirection based on user roles
		var isAdminRoute = adminRoutes.indexOf(nextLocation.originalPath) != -1;
		var isInstructorRoute = instructorRoutes.indexOf(nextLocation.originalPath) != -1;

		Auth.getUser()
			.then(function(data) {
				console.log('defining current user')
				currentUser = data.data || '';

				//if the route is admin route and user is not an admin
				if(isAdminRoute && currentUser.isAdmin)
						trigger = true;

				if (isInstructorRoute && currentUser.isInstructor)
						trigger = true; //allow admin to access instructor routes

				if((isAdminRoute || isInstructorRoute) && !trigger)
					$location.path('/'); //redirect if no conditions are met
				
				else
					$rootScope.deferredRounting.resolve(true);
			});

		$rootScope.isLoggedIn = Auth.isLoggedIn();

		return $rootScope.deferredRounting.promise;
	});
})