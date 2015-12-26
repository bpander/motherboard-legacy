define(['./Component', './polyfills/Array.prototype.find'], function (Component) {
    'use strict';


    /**
     * @constructor Dispatcher
     * @extends module:motherboard~Component
     * @classdesc  The Dispatcher class is meant to be used as a base class for complex, multi-component logic. Dispatcher extensions handle cross-module communication between child Components. The scope of a Dispatcher should be limited to a discrete set of behaviors, e.g. an ajax-form that lives in a modal that needs to close the modal on success; if the modal is closed while the ajax-form is submitting, the ajax-form is aborted; etc.
     */
    function Dispatcher (element, options) {
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
});
