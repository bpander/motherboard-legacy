# motherboard

Motherboard is a small, extensible boilerplate for client-side JavaScript applications. It's designed to make common architecture issues (separation of concerns, cross-module communication) easier to handle and common tasks (querying elements, binding events) more concise (read: less tedious).

## Installation
`bower install motherboard --save`

```javascript
// Via CommonJS
var motherboard = require('motherboard');
var Component = require('motherboard').Component;
```
```html
<!-- Via old school script tags -->
<script src="bower_components/motherboard/dist/motherboard.js"></script>
<script>
(function () {
    var Component = motherboard.Component;
}());
</script>
```

## Getting Started
Motherboard is essentially three base classes (`Component`, `Dispatcher`, and `App`) and a static class (`Parser`).

**Component** - Used for basic UI Components (a carousel or a modal or an ajax-form could each merit their own Component extension). A Component is meant to be standalone and only care about itself and its members. For cases where different Components need to "talk" to each other, a *Dispatcher* is used to handle cross-module communication.

**Dispatcher** - (extends Component) Used for complex, multi-component logic. Dispatchers handle cross-module communication between child Components. The scope of a Dispatcher should be limited to a discrete set of behaviors. For example, let's say there's an ajax-form that lives in a modal that needs to close the modal on success or, if the modal is closed while the ajax-form is submitting, the ajax-form is aborted. One Dispatcher would be created to handle that set of (thematically linked) behaviors.

**App** - (extends Dispatcher) The head honcho. An App resolves cases where Dispatchers need to communicate with each other or other top-level application logic, e.g. calling picturefill on responsive images whenever new ones are added to the DOM.

**Parser** - A static class that's responsible for turning HTML elements into motherboard objects and destroying those motherboard objects when the elements are removed.


### Differences from MVC Frameworks

#### Addresses Complex UI behaviors
Angular, React, and similar frameworks are good for RESTful applications (updating views as data changes). What they don't seem to address is complex behaviors between UI components, e.g. clicking a button causes a specific panel on a specific accordion to expand and navigate an inner carousel to a specific slide. Motherboard attempts to make coordinating between disparate components easy.

#### Not monolithic
Motherboard is meant to be a foundation to build on. As such, it doesn't force a specific Router or templating engine on you. You can use whatever components are appropriate for your project, and if one stops being good, you can easily swap it out for a different (better) one.

## Examples

Dispatchers and Components can be instantiated via data attributes (`data-dispatcher` and `data-component` respectively). Specific elements can be "tagged" with a `data-tag` attribute.

<small>**Note:** The `data-tag="ClassName:propertyName"` isn't a required naming convention, just one I've found helpful.</small>

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
</div>
```

```javascript
// Initializing an application
motherboard
    .components({
        // Map component definitions to a string identifier
        FormComponent: require('components/FormComponent'), // CommonJS way
        FaderComponent: window.FaderComponent // global scope way
    })
    .dispatchers({
        // Do the same with dispatchers
        DemoDispatcher: (function () {
            ...
            return DemoDispatcher;
        }()) // IIFE way
    })
    .mount(window.app = new App()); // Mount the application (we set it to window.app so we can access it more easily from dev tools)


// Dispatcher definition example
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Custom_objects to learn about pre-ES6 JS "classes"
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