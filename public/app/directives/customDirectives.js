angular.module('customDirectives', [])

.directive('scrollOnClick', function($window) {
	var w = angular.element($window);
  return {
    restrict: 'A',
    link: function(scope, $elm) {
      $elm.on('click', function() {
        $("body, html").animate({scrollTop: w.height()}, 2000);
      });
    }
  }
});