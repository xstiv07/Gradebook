angular.module('customDirectives', [])

.directive('scrollOnClick', function($window) {
  return {
    restrict: 'A',
    link: function(scope, $elm) {
      $elm.on('click', function() {
        $("body").animate({scrollTop: $window.innerHeight}, 2000);
      });
    }
  }
});