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
