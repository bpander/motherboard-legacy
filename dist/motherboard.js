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
var Binding, Component, polyfills_Arrayprototypefind, Dispatcher, App, Parser, motherboard;
Binding = function () {
  function Binding(target, type, handler) {
    this.target = target;
    this.type = type;
    this.handler = handler;
    this.isEnabled = false;
  }
  Binding.prototype.enable = function () {
    if (this.isEnabled === true) {
      return;
    }
    if (this.target instanceof EventEmitter) {
      this.target.on(this.type, this.handler);
    } else if (this.target instanceof EventTarget) {
      this.target.addEventListener(this.type, this.handler);
    } else if (this.target instanceof NodeList) {
      var i = this.target.length;
      while (--i > 0) {
        this.target[i].addEventListener(this.type, this.handler);
      }
    }
  };
  Binding.prototype.disable = function () {
    if (this.target instanceof EventEmitter) {
      this.target.off(this.type, this.handler);
    } else if (this.target instanceof EventTarget) {
      this.target.removeEventListener(this.type, this.handler);
    } else if (this.target instanceof NodeList) {
      var i = this.target.length;
      while (--i > 0) {
        this.target[i].removeEventListener(this.type, this.handler);
      }
    }
    this.isEnabled = false;
  };
  return Binding;
}();
Component = function (Binding) {
  /**
       * @class Component
       * @extends EventEmitter
       * @see [bpander/EventEmitter]{@link https://github.com/bpander/EventEmitter}
       * @classdesc The Component class is meant to be used as a base class for basic UI Components. For example, a carousel or a cross-fader or an ajax-form could each merit their own Component extension. A Component extension is meant to be standalone and only care about itself and its members. For cases where different Components need to "talk" to each other, a {@link module:motherboard~Dispatcher} should be used to handle cross-module communication.
       * @param {HTMLElement} element     - The root HTML element to use as the Component.
       * @param {Object}      [options]   - Optional. Overrides to the Constructor.options object.
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
  function Component(element, options) {
    EventEmitter.call(this);
    this.element = element;
    this.options = Object.assign({}, this.constructor.options, options);
    this.bindings = [];
  }
  Component.prototype = Object.create(EventEmitter.prototype);
  var proto = Component.prototype;
  proto.constructor = Component;
  /**
       * The configurable options for the Component and their defaults.
       *
       * @name options
       * @memberof module:motherboard~Component
       * @type {Object}
       * @example
  CarouselComponent.options = {
      activeSlideClass: 'active'
  };
       */
  Component.options = {};
  proto.init = function () {
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
}(Binding);
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;
    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
polyfills_Arrayprototypefind = undefined;
Dispatcher = function (Component) {
  /**
   * @constructor Dispatcher
   * @extends module:motherboard~Component
   * @classdesc  The Dispatcher class is meant to be used as a base class for complex, multi-component logic. Dispatcher extensions handle cross-module communication between child Components. The scope of a Dispatcher should be limited to a discrete set of behaviors, e.g. an ajax-form that lives in a modal that needs to close the modal on success; if the modal is closed while the ajax-form is submitting, the ajax-form is aborted; etc.
   */
  function Dispatcher(element, options) {
    Component.call(this, element, options);
    this.components = [];
  }
  Dispatcher.prototype = Object.create(Component.prototype);
  var proto = Dispatcher.prototype;
  proto.constructor = Dispatcher;
  /**
       * Returns the first child component instance of the specified type or `null` if none are found.
       * 
       * @method getComponent
       * @memberOf module:motherboard~Dispatcher
       * @instance
       * @param  {T} T  - A component type to search for.
       * @return {module:motherboard~Component|null}  A component instance of type T.
       * @example
  <!-- given this markup -->
  <div data-dispatcher="ExampleDispatcher">
  
      <form data-component="FormComponent" id="first">
      </form>
  
      <form data-component="FormComponent" id="second">
      </form>
  
  </div>
       * @example
  var exampleDispatcher = app.getDispatcher(ExampleDispatcher);
  exampleDispatcher.getComponent(FormComponent); // will return the FormComponent instance for the '#first' element
  exampleDispatcher.getComponents(FormComponent); // will return both FormComponent instances
  exampleDispatcher.getComponent(CarouselComponent); // will return `null`
  
       */
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
}(Component);
App = function (Dispatcher) {
  function App(element, options) {
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
}(Dispatcher);
Parser = function (App, Dispatcher, Component) {
  var Parser = {};
  Parser._app = null;
  Parser._componentLookup = {};
  Parser._dispatcherLookup = {};
  var COMPONENT_KEY = 'motherboardComponent';
  var DISPATCHER_KEY = 'motherboardDispatcher';
  var _reverseLookup = function (object, value) {
    var prop;
    for (var prop in object) {
      if (object.hasOwnProperty(prop)) {
        if (object[prop] === value) {
          return prop;
        }
      }
    }
  };
  Parser.parse = function (scope) {
    scope = scope === undefined ? document.body : scope;
    var i;
    var l;
    var dispatcherElements = Array.prototype.slice.call(scope.querySelectorAll('[data-dispatcher]'));
    var componentElements = Array.prototype.slice.call(scope.querySelectorAll('[data-component]'));
    var dispatchers = Parser._app.dispatchers;
    var components = Parser._app.components;
    if (scope.dataset.dispatcher !== undefined) {
      dispatcherElements.unshift(scope);
    }
    if (scope.dataset.component !== undefined) {
      componentElements.unshift(scope);
    }
    l = dispatcherElements.length;
    for (i = 0; i < l; i++) {
      Parser.registerDispatcher(dispatcherElements[i]);
    }
    l = componentElements.length;
    for (i = 0; i < l; i++) {
      Parser.registerComponent(componentElements[i]);
    }
    l = dispatchers.length;
    for (i = 0; i < l; i++) {
      dispatchers[i].init();
    }
    l = components.length;
    for (i = 0; i < l; i++) {
      components[i].init();
    }
  };
  Parser.unparse = function (scope) {
    var component;
    var dispatcher;
    var componentElement;
    var dispatcherElement;
    var dispatcherElements = Array.prototype.slice.call(scope.querySelectorAll('[data-dispatcher]'));
    var componentElements = Array.prototype.slice.call(scope.querySelectorAll('[data-component]'));
    if (scope.dataset.dispatcher !== undefined) {
      dispatcherElements.unshift(scope);
    }
    if (scope.dataset.component !== undefined) {
      componentElements.unshift(scope);
    }
    var app = Parser._app;
    var appElement = app.element;
    var parentElement;
    var i = componentElements.length;
    while ((componentElement = componentElements[--i]) !== undefined) {
      component = componentElement[COMPONENT_KEY];
      component.disable();
      component.destroy();
      parentElement = componentElement;
      while ((parentElement = parentElement.parentElement) !== appElement) {
        dispatcher = parentElement[DISPATCHER_KEY];
        if (dispatcher !== undefined) {
          dispatcher.components.splice(dispatcher.components.indexOf(component), 1);
        }
      }
      app.components.splice(app.components.indexOf(component), 1);
    }
    i = dispatcherElements.length;
    while ((dispatcherElement = dispatcherElements[--i]) !== undefined) {
      dispatcher.disable();
      dispatcher.destroy();
      app.dispatchers.splice(app.dispatchers.indexOf(dispatcher), 1);
    }
  };
  Parser.registerComponent = function (element) {
    var name = element.dataset.component;
    var T = Parser._componentLookup[name];
    if (T === undefined) {
      throw new Error('Could not find component named "' + name + '" in component dictionary.');
    }
    var instance = new T(element, JSON.parse(element.dataset.options || '{}'));
    var parentElement = element;
    var appElement = Parser._app.element;
    var dispatcher;
    while ((parentElement = parentElement.parentElement) !== appElement) {
      dispatcher = parentElement[DISPATCHER_KEY];
      if (dispatcher !== undefined) {
        dispatcher.components.push(instance);
      }
    }
    element[COMPONENT_KEY] = instance;
    Parser._app.components.push(instance);
    return instance;
  };
  Parser.registerDispatcher = function (element) {
    var name = element.dataset.dispatcher;
    var T = Parser._dispatcherLookup[name];
    if (T === undefined) {
      throw new Error('Could not find dispatcher named "' + name + '" in dispatcher dictionary.');
    }
    var instance = new T(element, JSON.parse(element.dataset.options || '{}'));
    element[DISPATCHER_KEY] = instance;
    Parser._app.dispatchers.push(instance);
    return instance;
  };
  Parser.create = function (T, element) {
    var match;
    var proto = T.prototype;
    if (proto instanceof App) {
      throw new Error('Cannot create App this way. Use `motherboard.mount`.');
    } else if (proto instanceof Dispatcher) {
      match = _reverseLookup(Parser._dispatcherLookup, T);
      if (match === undefined) {
        throw new Error('Type not found in dictionary of Dispatchers registered with `motherboard.dispatcher(s)`');
      }
      element.dataset.dispatcher = match;
      return Parser.registerDispatcher(element);
    } else if (proto instanceof Component) {
      match = _reverseLookup(Parser._componentLookup, T);
      if (match === undefined) {
        throw new Error('Type not found in dictionary of Components registered with `motherboard.component(s)`');
      }
      element.dataset.component = match;
      return Parser.registerComponent(element);
    } else {
      throw new Error('Could not create component. Type not found.');
    }
  };
  return Parser;
}(App, Dispatcher, Component);
motherboard = function () {
  var motherboard = {
    App: App,
    Binding: Binding,
    Component: Component,
    Dispatcher: Dispatcher,
    Parser: Parser
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
}();
    return motherboard;
}));
