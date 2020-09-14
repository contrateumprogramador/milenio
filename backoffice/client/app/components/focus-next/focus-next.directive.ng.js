'use strict';

angular.module('fuseapp')
    .directive('focusNext', function() {
        return {
            restrict: 'A',
            require: '^form',
            scope: {
                focusNext: '=',
                onFocusNext: '='
            },
            link: function(scope, elem, attrs, ctrl) {
                var e = angular.element(elem);
                e.keyup(function() {
                    if (angular.element(this).val().length == scope.focusNext && Object.keys(ctrl[attrs.name].$error).length == 0) {
                        var inputs = e.closest('form').find(':input');
                        inputs.eq(inputs.index(this) + 1).focus();

                        if (scope.onFocusNext)
                            scope.onFocusNext();
                    }
                });
            }
        }
    });
