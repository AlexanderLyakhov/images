;(function($ng) {

    var app = angular.module('app');

    app.directive('imageItemAddNew', function($imageList, $imageDialog) {

        return {
            restrict: 'E',
            replace: true,
            require: '^imageList',

            link: function($scope, $element, $attrs) {
                $element.on('click', function() {
                    $imageDialog.open();
                })
            },

            templateUrl: 'tpl-image-item-add-new'
        }
    });

})(angular.element);
