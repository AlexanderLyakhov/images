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
