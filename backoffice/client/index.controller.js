(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, $scope, $mdMedia)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;

        vm.isMobile = $mdMedia('xs');

        $scope.$watch(function() {
            return $mdMedia('xs');
        }, function(newValue, oldValue, scope) {
            vm.isMobile = newValue
        });

        //////////
    }
})();