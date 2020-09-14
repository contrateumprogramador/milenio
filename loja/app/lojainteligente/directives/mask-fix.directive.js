module.exports = function(ngModule){
    ngModule.directive('maskFix', function($timeout) {
        return {
            require: 'ngModel',
            link: function($scope, $element, $attrs) {
              $element.bind('keydown', function ($event) {
                $timeout(function () {
                  $event.target.selectionStart = $event.target.value.length;
                  $event.target.selectionEnd = $event.target.value.length;
                });
              });            
            }
        };
    });
};