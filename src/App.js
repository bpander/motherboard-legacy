(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.App = factory();
    }
}(this, function (require) {
    'use strict';

    var Dispatcher = require('motherboard/Dispatcher');


    function App (element, options) {
        Dispatcher.call(this, element || document.body, options);

        this.dispatchers = [];

    }
    App.prototype = Object.create(Dispatcher.prototype);
    var proto = App.prototype;
    proto.constructor = App;


    App.prototype.getDispatcher = function (T) {
        return this.dispatchers.find(function (dispatcher) {
            return dispatcher.constructor === T;
        }) || null;
    };


    App.prototype.getDispatchers = function (T) {
        return this.dispatchers.filter(function (dispatcher) {
            return dispatcher.constructor === T;
        });
    };


    return App;
}));
