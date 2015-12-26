define(['./Binding'], function (Binding) {
    'use strict';


    /**
     * @class Component
     * @extends EventEmitter
     * @see [bpander/EventEmitter]{@link https://github.com/bpander/EventEmitter}
     * @classdesc The Component class is meant to be used as a base class for basic UI Components. For example, a carousel or a cross-fader or an ajax-form could each merit their own Component extension. A Component extension is meant to be standalone and only care about itself and its members. For cases where different Components need to "talk" to each other, a {@link module:motherboard~Dispatcher} should be used to handle cross-module communication.
     * @param {HTMLElement} element     - The root HTML element to use as the Component.
     * @param {Object}      [options]   - Overrides to the constructor.options object
     * @example
// Defining a Component

var Component = require('motherboard').Component;


function CarouselComponent (element, options) {
    Component.call(this, element, options);

    this.slideCount = 0;

    this.index = 0;

}


CarouselComponent.options = {
    activeSlideClass: 'active'
};


Object.assign(CarouselComponent.prototype, Component.prototype, {
    constructor: CarouselComponent,

    init: function () {

    }
});

     * @example
// Instantating via the Parser
var Parser = require('motherboard').Parser;
Parser.create(CarouselComponent, document.createElement('div'));

     * @example
<!-- Instantiating via data attribute -->
<div data-component="CarouselComponent" data-options='{ "activeSlideClass": "carousel-slide_active" }'>
    ...
</div>
     */
    function Component (element, options) {
        EventEmitter.call(this);

        this.element = element;

        this.options = Object.assign({}, this.constructor.options, options);

        this.bindings = [];

    }
    Component.prototype = Object.create(EventEmitter.prototype);
    var proto = Component.prototype;
    proto.constructor = Component;


    proto.init = function () {
        // Intentional no-op
    };


    proto.destroy = function () {
        var prop;
        this.disable();
        for (prop in this) {
            if (this.hasOwnProperty(prop)) {
                this[prop] = null;
            }
        }
    };


    proto.getTag = function () {
        return this.element.dataset.tag;
    };


    proto.findWithTag = function (tag) {
        return this.element.querySelector('[data-tag="' + tag + '"]');
    };


    proto.findAllWithTag = function (tag) {
        return this.element.querySelectorAll('[data-tag="' + tag + '"]');
    };


    proto.createBinding = function (emitter, type, handler) {
        var binding = new Binding(emitter, type, handler.bind(this));
        this.bindings.push(binding);
        return binding;
    };


    proto.enable = function () {
        this.bindings.forEach(function (binding) {
            binding.enable();
        });
    };


    proto.disable = function () {
        this.bindings.forEach(function (binding) {
            binding.disable();
        });
    };


    return Component;
});
