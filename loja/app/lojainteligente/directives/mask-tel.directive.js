module.exports = function(ngModule){
    ngModule.directive('maskTel', function() {
      return {
          restrict: 'A',
          scope: {
              maskTel: "=",
          },
          require: '?ngModel',
          link: function($scope, $elem, attrs, ngModel) {

              var novoTel, flag = false, val;

              $elem.off('keyup');
              $elem.on('keyup', function(ev) {
                  if (ev.key) {
                      novoTel = String(ngModel.$viewValue).replace(/[\(\)\_\-/\s]/g, '');

                      if (novoTel.length == 10 && !flag) {
                          flag = true;
                          $scope.maskTel = "(99) 9999-9999";
                          $scope.$apply();
                      } else if (novoTel.length == 10 && flag) {
                          flag = false;
                          $scope.maskTel = "(99) 9?9999-9999";

                          $scope.$apply();
                          ngModel.$viewValue += ev.key;
                          ngModel.$render();

                      } else if (novoTel.length < 10) {
                          flag = false;
                      }
                  }
              });
          }
      };
    });
};
