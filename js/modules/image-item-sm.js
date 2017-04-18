;(function($ng) {

    var app = angular.module('app');

    app.directive('imageItemSm', function($imageList, $confirm, $imageDialog) {

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
                imageListCtrl.$imageElement = $element;

                $element.on('click', function(e)
                {
                    e.preventDefault();

                    imageListCtrl.unselectActiveImage();

                    var thumbnail = e.currentTarget.querySelector('.thumbnail');

                    imageListCtrl.$selectedItem = $ng(thumbnail);
                    imageListCtrl.$selectedItem.addClass('thumbnail-selected');
                });

                /*
                 *  Edit image
                 */
                $scope.$on('edit', function(e)
                {
                    $imageDialog.open({
                        id: $scope.id,
                        url: $scope.url,
                        title: $scope.title,
                        description: $scope.description
                    });

                    $imageDialog.on('close', function(e)
                    {
                        imageListCtrl.unselectActiveImage();
                        $imageDialog.off('close');
                    });
                });

                /*
                 *  Delete image
                 */
                $scope.$on('delete', function(e)
                {
                    $confirm
                        .open({
                            content: 'Delete selected image?'
                        })

                        .on('confirm', function() {
                            $imageList.remove($scope.id);
                            $confirm.off('confirm');
                        })

                        .on('close', function() {
                            imageListCtrl.unselectActiveImage();
                            $confirm.off('close');
                        });
                });

                /*
                 *  Cancel
                 */
                $scope.$on('cancel', function(e) {
                    imageListCtrl.unselectActiveImage();
                });
            },

            templateUrl: 'tpl-image-item'
        };
    });

    app.directive('imageActions', function() {

        return {
            restrict: 'EA',
            scope: {},

            link: function($scope, $element, attrs)
            {
                $element.on('click', function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();

                    if ($ng(e.target).hasClass('image-action__button'))
                    {
                        var action = e.target.getAttribute('data-action');

                        $scope.$emit(action);
                    }
                });
            },
        };
    });

})(angular.element);
