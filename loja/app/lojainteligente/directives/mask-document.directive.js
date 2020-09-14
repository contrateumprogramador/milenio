module.exports = function(ngModule){
    ngModule.directive('maskDocument', function() {
      return {
          restrict: 'A',
          scope: {
              maskDocument: "=",
          },
          require: '?ngModel',
          link: function($scope, $elem, attrs, ngModel) {

              var novoDocument, flag = false, val;

              $elem.off('keyup');
              $elem.on('keyup', function(ev) {
                  if (ev.key) {
                      novoDocument = String(ngModel.$viewValue).replace(/[\(\)\_\-/\s/\./]/g, '');

                      if (novoDocument.length == 11 && !flag) {
                          flag = true;
                          $scope.maskDocument = "?999.999.999-99";

                          var cpf = novoDocument.split("");
                          var newCpf = "";

                          for (var i = 0; i < cpf.length; i++) {
                            if (i == 2)
                              newCpf += cpf[i]+'.';
                            else if (i == 5)
                              newCpf += cpf[i]+'.';
                            else if (i == 8)
                              newCpf += cpf[i]+'-';
                            else
                              newCpf += cpf[i];
                          }

                          $scope.$apply();
                          ngModel.$viewValue = newCpf;
                          ngModel.$render();
        
                      } else if (novoDocument.length == 11 && flag) {
                          flag = false;
                          $scope.maskDocument = "?99.999.999/9999-99";
                          
                          var cnpj = novoDocument.split("");
                          var newCnpj = "";

                          for (var j = 0; j < cnpj.length; j++) {
                            if (j == 1)
                              newCnpj += cnpj[j]+'.';
                            else if (j == 4)
                              newCnpj += cnpj[j]+'.';
                            else if (j == 7)
                              newCnpj += cnpj[j]+'/';
                            else
                              newCnpj += cnpj[j];
                          }

                          $scope.$apply();
                          ngModel.$viewValue = newCnpj + ev.key;
                          ngModel.$render();

                      } else if (novoDocument.length < 11) {
                          flag = false;
                      }
                  }
              });
          }
      };
    });
};