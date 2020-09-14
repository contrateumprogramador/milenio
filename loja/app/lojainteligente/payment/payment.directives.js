module.exports = function(LojaInteligenteModule) {
    var removeDiacritics = require('diacritics').remove;

    LojaInteligenteModule
        .directive('focusNext', function() {
            return {
                restrict: 'A',
                require: '^form',
                scope: {
                    focusNext: '=',
                    onFocusNext: '='
                },
                link: function(scope, elem, attrs, ctrl) {
                    elem.on('keyup', function() {
                        var e = angular.element(this),
                            index = 0,
                            inputs = angular.element(document.querySelector('#ccForm')).find('input'),
                            v = e.val();

                        angular.forEach(inputs, function(item, key){
                            if (angular.equals(angular.element(item)[0], e[0]))
                                index = key;
                        });

                        if (v.length > scope.focusNext) {
                            e.val(v.substr(0, scope.focusNext));
                            ctrl[attrs.name].$viewValue = v.substr(0, scope.focusNext);
                            ctrl[attrs.name].$$rawModelValue = v.substr(0, scope.focusNext).replace(/ /g, '');
                        }

                        if (v.length == scope.focusNext && Object.keys(ctrl[attrs.name].$error).length === 0) {
                            inputs.eq(index + 1).focus();

                            if (scope.onFocusNext)
                                scope.onFocusNext();
                        }
                    });
                }
            };
        }).directive('creditCardName', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, modelCtrl) {
                    var capitalize = function(inputValue) {
                        if (inputValue === undefined) inputValue = '';
                        var capitalized = inputValue.toUpperCase();
                        if (capitalized !== inputValue) {
                            modelCtrl.$setViewValue(capitalized);
                            modelCtrl.$render();
                        }
                        return removeDiacritics(capitalized);
                    };
                    modelCtrl.$parsers.push(capitalize);
                    capitalize(scope[attrs.ngModel]); // capitalize initial value
                }
            };
        });
};
