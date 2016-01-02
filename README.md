# motherboard

Motherboard is a small, extensible boilerplate for client-side JavaScript applications. It's designed to make common architecture issues (separation of concerns, cross-module communication) easier to handle and common tasks (querying elements, binding events) more concise (read: less tedious).

## Installation
`bower install motherboard --save`

## Getting Started
A set of base classes.

### Differences from MVC Frameworks

#### Addresses Complex UI behaviors
Angular, React, and similar frameworks are good for RESTful applications (updating views as data changes). What they don't seem to address is complex behaviors between UI components, e.g. clicking a button causes a specific panel on a specific accordion to expand and navigate an inner carousel to a specific slide. Motherboard attempts to make coordinating between disparate components easy.

#### Not monolithic
Motherboard is meant to be a foundation to build on. As such, it doesn't force a specific Router or templating engine on you. You can use whatever components are appropriate for your project, and if one stops being good, you can easily swap it out for a different (better) one.

## Examples

```html
<div data-dispatcher="DemoDispatcher" data-options='{ "someConfigurableValue": "bar" }'>
    <div data-component="CarouselComponent" data-options='{ "autoplay": false }'> ... </div>
    <div data-component="FaderComponent">
        <ul>
            <li data-tag="FaderComponent:slide"></li>
            ...
        </ul>
    </div>
    <div data-component="FaderComponent" data-tag="DemoDispatcher:faderComponent"> ... </div>
    <ul data-tag="DemoDispatcher:listOfDynamicallyCreatedComponents"></ul>
    <div data-tag="DemoDispatcher:someCollectionOfElements"></div>
    <div data-tag="DemoDispatcher:someCollectionOfElements"></div>
    <div data-tag="DemoDispatcher:someCollectionOfElements"></div>
</div>
```

```javascript
// Initializing an application
motherboard
    // Map component definitions to a string identifier
    .components({
        FormComponent: require('components/FormComponent'), // CommonJS
        FaderComponent: window.FaderComponent // From a global scope
    })
    // Do the same with dispatchers
    .dispatchers({
        DemoDispatcher: (function () {
            ...
            return DemoDispatcher;
        }()) // IIFE
    })
    // Mount the application (we set it to window.app so we can access it more easily from the console)
    .mount(window.app = new App());


// Dispatcher definition example
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Custom_objects to learn about ES5 class extension
function DemoDispatcher (element, options) {
    Dispatcher.call(this, element, options);

    this.carouselComponent = null;

    this.faderComponent = null;

    // Grab the first child element with the specified tag we find or null if none are found
    this.listOfDynamicallyCreatedComponents = this.findWithTag('DemoDispatcher:listOfDynamicallyCreatedComponents');

    // Grab all child elements with the specified tag (returned as a NodeList)
    this.someCollectionOfElements = this.findAllWithTag('DemoDispatcher:someCollectionOfElements');

}
DemoDispatcher.prototype = Object.create(Dispatcher.prototype);
DemoDispatcher.prototype.constructor = DemoDispatcher;
var proto = DemoDispatcher.prototype;

// Define option defaults
DemoDispatcher.options = {
    someConfigurableValue: 'foo'
};


// .init will be invoked on instantiation
proto.init = function () {

    // Grab the first child component we find of the specified type
    this.carouselComponent = this.getComponent(CarouselComponent);

    // Grab all child components of the specified type (as an array)
    var faderComponents = this.getComponents(FaderComponent);

    // Grab the first component we find in an array of components with the specified tag (or null if not found)
    this.faderComponent = Parser.findWithTag(faderComponents, 'DemoDispatcher:faderComponent');

    // Creating a new component
    var element = this.listOfDynamicallyCreatedComponents.appendChild(document.createElement('li'));
    var newComponent = Parser.create(DynamicComponent, element, { someOption: 'override' });
    newComponent.foo('bar');

    // Binding a DOM event
    this.createBinding(this.listOfDynamicallyCreatedComponents, 'click', function (e) {
        console.log(this); // .createBinding automatically binds the callback's `this` keyword to the whatever instance called .createBinding
    });

    // Binding a custom event
    var handleSlideChange = function (e) {
        console.log(e.target); // The instance that emitted the custom event is passed with the event
        console.log(e.data); // Additional data can be passed when a custom event is emitted
        console.log(e.type); // The event type is also passed with a custom event

        if (e.target.getTag() === 'DemoDispatcher:special') {
            // if you only want to handle the event for some instances
        }
    };
    this.createBinding(this.carouselComponent, CarouselComponent.EVENT.SLIDE_CHANGE, handleSlideChange);

    this.enable(); // Enables all bindings
    this.disable(); // Disables all bindings

    // Manually enable/disable a specific event-binding
    var someBinding = this.createBinding(this.faderComponent, FaderComponent.EVENT.SLIDE_CHANGE, handleSlideChange);
    someBinding.enable();
    someBinding.disable();

};
```