angular.module('fuseapp')
    .directive("emptyAlert", function () {
        return {
            templateUrl: "client/app/components/empty-alert/empty-alert.view.html",
            restrict: "AE",
            replace: true,
            transclude: true,
            scope: {
                header: "@header",
                show: "=show"
            }
        };
    });
