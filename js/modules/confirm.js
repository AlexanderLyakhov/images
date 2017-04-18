;(function($ng) {

    var app = angular.module('app');

    app.factory('$confirm', function($modal) {
        return angular.copy($modal);
    });

    app.directive('confirm', function($confirm) {

        return {
            restrict: 'E',
            replace: true,

            scope: {},

            link: function($scope, $element, attrs)
            {
                $confirm.$element = $element;

                $confirm.on('open', function open(data)
                {
                    $scope.$apply(function() {
                        $scope.title = data.title || 'Confirm';
                        $scope.content = data.content || 'Are you shure?';
                    });
                });

                $element.on('click', function(e)
                {
                    var action = e.target.getAttribute('data-action');

                    if ($ng(e.target).hasClass('dialog__button')) {
                        $confirm.trigger(action).close();
                    }
                });
            },

            templateUrl: 'tpl-confirm'
        };
    });

})(angular.element);
