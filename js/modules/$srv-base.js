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
