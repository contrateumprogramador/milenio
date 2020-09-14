'use strict';

angular.module('fuseapp')
    .directive('pageHeader', function() {
        return {
            restrict: 'E',
            templateUrl: 'client/app/components/pageHeader/page-header.view.ng.html',
            replace: true,
            transclude: true,
            link: function(scope, elem, attrs) {
                
            }
        };
    });
