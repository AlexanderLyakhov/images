;(function($ng) {

    var app = angular.module('app');

    app.directive('imageList', function($imageList, $compile) {

        return {
            restrict: 'A',
            scope: true,

            controller: function($scope, $element, $attrs) {

                var _this = this;

                $imageList.getData(function(data) {
                    _this.images = data;
                });

                this.unselectActiveImage = function unselectActiveImage()
                {
                    if (this.$selectedItem) {
                        this.$selectedItem.removeClass('thumbnail-selected');
                    }
                };
            },

            controllerAs: 'imageList',

            link: function($scope, $element, $attrs, ctrl) {
                var _this = this;

                $imageList.on('update', function() {
                    _this.render(ctrl, $scope);
                });
            },

            render: function(ctrl, $scope) {
                $compile(ctrl.$imageElement.html())($scope);

                return this;
            }
        }
    });

})(angular.element);
