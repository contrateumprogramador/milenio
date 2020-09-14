'use strict';

angular.module('fuseapp')
    .filter('dateFilter', function() {
        return function(input, type) {
            if (input) {
                input = input.toString();
                return (input.length == 1) ? '0' + input : input;
            }

            if (type) {
                switch (type) {
                    case 'year':
                        return 'AA';
                        break;
                    case 'month':
                        return 'MM';
                        break;
                }
            }

            return 'MM';
        };
    });
