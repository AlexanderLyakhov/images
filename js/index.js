// 
// main.js 
// 
(function($ng) {

    var app = angular.module('app', ['ngMockE2E']);

    app.run(function($httpBackend) {
        console.debug('run');

        var images = [
                {
                    "id": "96860a755",
                    "url": "https://cdnb.artstation.com/p/assets/images/images/004/503/509/large/kip-kubisz-vd1s.jpg?1484145991",
                    "title": "111",
                    "description": "aaa"
                },
                {
                    "id": "147d79737e6",
                    "url": "https://cdna.artstation.com/p/assets/images/images/004/503/508/large/kip-kubisz-vd6s.jpg?1484145945",
                    "title": "",
                    "description": ""
                },
                {
                    "id": "16da483d69",
                    "url": "https://cdna.artstation.com/p/assets/images/images/004/503/510/large/kip-kubisz-vd2s.jpg?1484145953",
                    "title": "",
                    "description": ""
                },
                {
                    "id": "732de1df1f",
                    "url": "https://cdnb.artstation.com/p/assets/images/images/004/503/511/large/kip-kubisz-vd3s.jpg?1484145956",
                    "title": "",
                    "description": ""
                },
                {
                    "id": "9d6d08cd23",
                    "url": "https://cdna.artstation.com/p/assets/images/images/004/503/512/large/kip-kubisz-vd4s.jpg?1484145958",
                    "title": "",
                    "description": ""
                },
                {
                    "id": "12461d965da",
                    "url": "https://cdna.artstation.com/p/assets/images/images/004/412/818/large/bo-zolland-009.jpg?1483541047",
                    "title": "",
                    "description": ""
                },
                {
                    "id": "3c13aa6bac",
                    "url": "https://cdna.artstation.com/p/assets/images/images/004/738/594/large/bo-zolland-runabout358.jpg?1485900974",
                    "title": "222",
                    "description": "sss"
                }
        ];

        $httpBackend
            .whenGET('/images')
            .respond(200, images);

        $httpBackend
            .whenPOST('/images/add')
            .respond(function(method, url, data) {
                console.debug('add', arguments, data);
                return [200, JSON.parse(data)];
            });

        $httpBackend
            .whenPOST('/images/update')
            .respond(function(method, url, data) {
                console.debug('update', arguments, data);
                return [200, JSON.parse(data)];
            });

        $httpBackend
            .whenDELETE('/images/delete')
            .respond(function(method, url, data) {
                console.debug('delete', arguments, data);
                return [200, data];
            });
    });

    app.controller('imageListCtrl', function($scope, $element, $attrs, images, $compile) {
        /*
        this.name = 'imageListCtrl';
        $scope.images = images.getData();
        */
    });

})(angular.element)
 
// 
// $srv-base.js 
// 
;(function($ng) {

    var app = angular.module('app');

    app.factory('$baseSrv', function() {

        return {
            events: {},

            config: function config(config) {

                var _this = this;

                for(var key in config)
                {
                    if (typeof(config[key]) === 'function') {
                        _this.on(key, config[key]);
                    }
                    else {
                        _this[key] = config[key];
                    }
                }

                return this;
            },

            trigger: function trigger(name, data) {

                this.events[name] && this.events[name].forEach(function(fn) {
                    fn.call(null, data);
                });

                console.debug('trigger', name, this.events[name]);

                return this;
            },

            on: function on(name, fn, _one) {

                if (this.events[name] === undefined) {
                    this.events[name] = [];
                }

                this.events[name].push(fn);

                return this;
            },

            off: function off(name) {

                if (this.events[name])
                {
                    while (this.events[name].length) {
                        delete this.events[name].shift();
                    }
                }

                return this;
            }
        }
    });

})(angular.element);
 
// 
// $srv-image-list.js 
// 
;(function($ng) {

    var app = angular.module('app');

    app.factory('$imageList', function($baseSrv, $http) {

        var data = null;

        return angular.extend({}, $baseSrv,
        {
            getData: function getData(fn)
            {
                if (data) return data;

                var _this = this;

                $http({
                    method: 'GET',
                    url: '/images'
                })
                .then(
                    function success(response) {
                        data = response.data;

                        _this.trigger('data', data);
                        fn && fn(data);
                    },

                    function error(res) {
                        console.debug('error');

                        _this.trigger('data', []);
                        fn && fn([]);
                    }
                );

                return this;
            },

            defer: function defer(action, dfr)
            {
                var _this = this;

                dfr.then(
                    function success(response) {
                        _this['_' + action](response.data);
                    },

                    function error(res) {
                        console.warn(res);
                    }
                );

                return this;
            },

            add: function add(img)
            {
                this.defer('add',

                    $http({
                        method: 'POST',
                        url: '/images/add',
                        data: img
                    })
                );

                return this;
            },

            update: function update(img)
            {
                this.defer('update',

                    $http({
                        method: 'POST',
                        url: '/images/update',
                        data: img
                    })
                );

                return this;
            },

            remove: function remove(id)
            {
                this.defer('remove',

                    $http({
                        method: 'DELETE',
                        url: '/images/delete',
                        data: id
                    })
                );

                return this;
            },

            _add: function _add(img)
            {
                data.unshift(img);
                return this.trigger('update', img);
            },

            _update: function _update(img)
            {
                for (var i = 0; i < data.length; i++)
                {
                    if (data[i].id === img.id) {
                        data[i] = img;
                        return this.trigger('update', img);
                    }
                }

                return this;
            },

            _remove: function _remove(id)
            {
                for (var i = 0; i < data.length; i++)
                {
                    if (data[i].id === id) {
                        data.splice(i, 1);
                        return this.trigger('update', id);
                    }
                }

                return this;
            }
        });
    });

})(angular.element);
 
// 
// $srv-modals-callback-edition.js 
// 
;(function($ng) {

    var app = angular.module('app');

    app.factory('$modal', function($baseSrv) {

        return angular.extend({}, $baseSrv,
        {
            show: function show(name, data)
            {
                if (this[name])
                {
                    this.onShow = (data || {}).onShow;
                    this.onHide = (data || {}).onHide;

                    this[name].css('display', 'flex');
                    this.onShow && this.onShow.call(this, data);
                }

                return this.trigger('open', data);
            },

            hide: function hide(name, data)
            {
                if (this[name])
                {
                    this[name].css('display', 'none');
                    this.onHide && this.onHide.call(this, data);
                }

                return this.trigger('close', data);
            }
        });
    });

})(angular.element);
 
// 
// $srv-modals.js 
// 
;(function($ng) {

    var app = angular.module('app');

    app.factory('$modal', function($baseSrv) {

        return angular.extend({}, $baseSrv,
        {
            open: function open(data)
            {
                var _this = this;

                $ng(document.body).on('keydown', function(e) {
                    if (e.keyCode === 27) {
                        _this.close();
                    }
                });

                this.$element.css('display', 'flex');
                return this.trigger('open', data);
            },

            close: function close(data)
            {
                $ng(document.body).off('keydown');

                this.$element.css('display', 'none');
                return this.trigger('close', data);
            }
        });
    });

})(angular.element);
 
// 
// confirm.js 
// 
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
 
// 
// image-dialog.js 
// 
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
 
// 
// image-item-add-new.js 
// 
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
 
// 
// image-item-lg.js 
// 
;(function($ng) {

    var app = angular.module('app');

    app.directive('imageItemLg', function($imageList, $confirm, $imageDialog) {

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

            templateUrl: 'tpl-image-item-lg'
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
 
// 
// image-item-sm.js 
// 
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
 
// 
// image-list.js 
// 
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
 
// 
// navbar.js 
// 
;(function($ng) {

    var app = angular.module('app');

    app.directive('navbar', function() {

        return {
            restrict: 'A',
            scope: {},

            link: function($scope, $element, attrs)
            {
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
 
