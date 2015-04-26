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
			instructorAccess: true
		})
		.when('/classes/addStudents/:class_id', {
			templateUrl: 'app/views/pages/classes/addStudents.html',
			controller: 'addStudentsController',
			controllerAs: 'addStudents'
		})
		// ------------assignment-routes---------------
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
		var isAdminRoute = adminRoutes.indexOf(nextLocation.originalPath) != -1;
		var isInstructorRoute = instructorRoutes.indexOf(nextLocation.originalPath) != -1;

		console.log(instructorRoutes)

		Auth.getUser()
			.then(function(data) {
				currentUser = data.data;
				//'shortcut' variables to access in child controllers
				isAdmin = data.data.roles.indexOf('Admin') != -1;
				isInstructor = data.data.roles.indexOf('Instructor') != -1;

				//if the route is admin route and user is not an admin
				if(isAdminRoute &&  currentUser.roles.indexOf('Admin') === -1)
					$location.path('/');
				//if the route is instructor route and usere is not an instructor
				if(isInstructorRoute && currentUser.roles.indexOf('Instructor') === -1)
					$location.path('/');
				else
					$rootScope.deferredRounting.resolve(true);
			});

		$rootScope.isLoggedIn = Auth.isLoggedIn();

		return $rootScope.deferredRounting.promise;
	});
})