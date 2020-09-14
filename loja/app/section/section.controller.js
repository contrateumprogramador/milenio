module.exports = function(ngModule) {
    require('./section.sass');
    ngModule.controller('SectionCtrl', function($document, $mdDialog, $rootScope, $scope, $state, $stateParams, $mdMedia, Loja, toast) {
        var vm = this,
            sections = $rootScope.sections;


        // Methods
        vm.section = getSection;


        function getSection() {
            var r = {};
            if ($rootScope.sections) {
                angular.forEach($rootScope.sections, function(section) {
                    if (section.url == $stateParams.sectionUrl)
                        r = section;
                });
            }
            return r;
        }

        // Methods

        // Funtions
        
    });
};
