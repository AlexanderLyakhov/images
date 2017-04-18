;(function($ng) {

    var app = angular.module('app');

    app.factory('$imageDialog', function($modal) {
        return angular.copy($modal);
    });

    app.directive('imageDialog', function($imageDialog, $imageList) {

        var MODE_ADD  = 1;
        var MODE_EDIT = 2;

        var mode = 0;

        var form = frmImageDialog;

        return {
            restrict: 'EA',

            link: function($scope, $element, attrs) {

                var _this = this;

                $scope.image = angular.copy({});

                $imageDialog.config(
                {
                    $element: $element,

                    open: function(data)
                    {
                        mode = !data ? MODE_ADD : MODE_EDIT;

                        $scope.$apply(function()
                        {
                            if (mode === MODE_ADD) {
                                $scope.dialogTitle = 'New image';
                                $scope.image = {id: _this.uid()};
                            }
                            else {
                                $scope.dialogTitle = 'Edit image';
                                $scope.image = angular.copy(data);
                            }
                        });

                        form.imageUrl.focus();
                    }
                });

                $ng(form.btnSave).on('click', function(e)
                {
                    console.debug('$scope.image', $scope.image);

                    mode === MODE_ADD ?
                        $imageList.add($scope.image):
                        $imageList.update($scope.image);

                    _this
                        .reset($scope)
                        .close();
                });

                $ng(form.btnCancel).on('click', function(e)
                {
                    _this
                        .reset($scope)
                        .close();
                });

                return this;
            },

            uid: function uid() {
                return Math.floor((Math.random() * new Date().getTime())).toString(16);
            },

            reset: function($scope)
            {
                $scope.$apply(function() {
                    $scope.image = angular.copy({});
                    $scope.frmImageDialog.$setPristine();
                });

                $ng(form.getElementsByClassName('image-preview')).attr('src', '');

                form.imageUrl.focus();

                return this;
            },

            close: function close()
            {
                $imageDialog.close();
                return this;
            }
        }
    });

})(angular.element);
