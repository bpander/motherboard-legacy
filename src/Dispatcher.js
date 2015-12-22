(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Dispatcher = factory();
    }
}(this, function (require) {
    'use strict';

    require('motherboard/polyfills/Array.prototype.find');
    var Component = require('motherboard/Component');


    function Dispatcher (element, options) {
        Component.call(this, element, options);

        this.components = [];

    }
    Dispatcher.prototype = Object.create(Component.prototype);
    var proto = Dispatcher.prototype;
    proto.constructor = Dispatcher;


    proto.getComponent = function (T) {
        return this.components.find(function (component) {
            return component.constructor === T;
        }) || null;
    };


    proto.getComponents = function (T) {
        return this.components.filter(function (component) {
            return component.constructor === T;
        });
    };


    return Dispatcher;
}));
