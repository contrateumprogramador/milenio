module.exports = function(ngModule){
    ngModule.factory('toast', function($mdToast) {

        // Private API

        // Public API
        return {
            message: function(msg, duration) {
            	$mdToast.show(
                    $mdToast.simple()
                    .content(msg)
                    .position('top right')
                    .hideDelay(duration || 4000)
                );

                return;
            }
        };
    });
};