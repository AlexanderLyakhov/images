;(function($ng) {

    var app = angular.module('app');

    app.directive('navbar', function() {

        return {
            restrict: 'A',
            scope: {},

            link: function($scope, $element, attrs)
            {
                console.debug('navbar');

                $element.on('click', function(e) {

                    $ng(e.currentTarget)
                        .find('li')
                        .removeClass('active');

                    $ng(e.target.parentNode)
                        .addClass('active');
                });

            }
        };
    });

})(angular.element);
