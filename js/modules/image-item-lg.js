;(function($ng) {

    var app = angular.module('app');

    app.directive('imageItemLg', function($imageList, $confirm, $imageDialog) {

        var showDescription = 0;

        return {
            restrict: 'E',
            replace: true,
            require: '^imageList',

            scope: {
                id: '@imgId',
                url: '@imgUrl',
                title: '@imgTitle',
                description: '@imgDescription'
            },

            link: function($scope, $element, attrs, imageListCtrl)
            {
                $scope.$on('badgeClick', function(e, data)
                {
                    $scope.$apply(function() {
                        $scope.expanded = (showDescription ^= 1) ? 'expanded':''
                    });
                });
            },

            templateUrl: 'tpl-image-item-lg'
        };
    });

    app.directive('previewImageInfoBage', function() {

        return {
            restrict: 'C',
            scope: {},

            link: function($scope, $element, attrs)
            {
                $element.on('click', function(e) {
                    $scope.$emit('badgeClick');
                });
            }
        };
    });

})(angular.element);
