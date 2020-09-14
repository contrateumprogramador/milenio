'use strict';

angular.module('fuseapp')
    .factory('cep', function($http) {

        // Private API


        // Public API
        return {
            getAddress: function(zip) {
                return $http.get('https://viacep.com.br/ws/' + zip + '/json');
            }
        };
    });
