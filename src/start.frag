(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.motherboard = factory(function (name) {
            return root[name];
        });
    }
}(this, function (require) {
    'use strict';

    var EventEmitter = require('EventEmitter');


    /**
     * @module motherboard
     */
