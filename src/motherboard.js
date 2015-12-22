(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.motherboard = factory();
    }
}(this, function (require) {
    'use strict';

    var motherboard = {
        App: require('motherboard/App'),
        Binding: require('motherboard/Binding'),
        Component: require('motherboard/Component'),
        Dispatcher: require('motherboard/Dispatcher'),
        Parser: require('motherboard/Parser')
    };


    motherboard.component = function (name, value) {
        motherboard.Parser._componentLookup[name] = value;
    };


    motherboard.components = function (dictionary) {
        motherboard.Parser._componentLookup = dictionary;
    };


    motherboard.dispatchers = function (dictionary) {
        motherboard.Parser._dispatcherLookup = dictionary;
    };


    motherboard.mount = function (app) {
        motherboard.Parser._app = app;
        motherboard.Parser.parse(app.element);
        app.init();
    };


    return motherboard;
}));