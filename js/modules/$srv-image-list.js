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
