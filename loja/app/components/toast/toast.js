module.exports = function(ngModule){
    ngModule.factory('toast', function($mdToast) {

        // Private API

        // Public API
        return {
            message: function(msg, duration) {
            	$mdToast.show(
                    $mdToast.simple()
                    .textContent(msg)
                    .position('top right')
                    .hideDelay(duration || 2000)
                );

                return;
            }
        };
    });
};