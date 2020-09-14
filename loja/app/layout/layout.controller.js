module.exports = function(ngModule){
    require('./layout.sass');
    ngModule.controller('LayoutCtrl', function($rootScope, $scope, $state) {
        var layout = this;

        // Root Scope
        $rootScope.pageTitle = 'Milênio Móveis';

        // Vars
        layout.package = $state.params.type || 'familia';


        // Methods


        // Functions
        
    });
};