<a name="module_motherboard"></a>
## motherboard

* [motherboard](#module_motherboard)
    * [~Component](#module_motherboard..Component) ⇐ <code>EventEmitter</code>
        * [new Component(element, [options])](#new_module_motherboard..Component_new)
        * [.options](#module_motherboard..Component.options) : <code>Object</code>
    * [~Dispatcher](#module_motherboard..Dispatcher) ⇐ <code>[Component](#module_motherboard..Component)</code>
        * [.getComponent(T)](#module_motherboard..Dispatcher+getComponent) ⇒ <code>[Component](#module_motherboard..Component)</code> &#124; <code>null</code>

<a name="module_motherboard..Component"></a>
### motherboard~Component ⇐ <code>EventEmitter</code>
The Component class is meant to be used as a base class for basic UI Components. For example, a carousel or a cross-fader or an ajax-form could each merit their own Component extension. A Component extension is meant to be standalone and only care about itself and its members. For cases where different Components need to "talk" to each other, a [Dispatcher](#module_motherboard..Dispatcher) should be used to handle cross-module communication.

**Kind**: inner class of <code>[motherboard](#module_motherboard)</code>  
**Extends:** <code>EventEmitter</code>  
**See**: [bpander/EventEmitter](https://github.com/bpander/EventEmitter)  

* [~Component](#module_motherboard..Component) ⇐ <code>EventEmitter</code>
    * [new Component(element, [options])](#new_module_motherboard..Component_new)
    * [.options](#module_motherboard..Component.options) : <code>Object</code>

<a name="new_module_motherboard..Component_new"></a>
#### new Component(element, [options])

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The root HTML element to use as the Component. |
| [options] | <code>Object</code> | Optional. Overrides to the Constructor.options object. |

**Example**  
```js
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
```
**Example**  
```js
// Instantating via the Parser
  var Parser = require('motherboard').Parser;
  Parser.create(CarouselComponent, document.createElement('div'));
```
**Example**  
```js
<!-- Instantiating via data attribute -->
  <div data-component="CarouselComponent" data-options='{ "activeSlideClass": "carousel-slide_active" }'>
      ...
  </div>
```
<a name="module_motherboard..Component.options"></a>
#### Component.options : <code>Object</code>
The configurable options for the Component and their defaults.

**Kind**: static property of <code>[Component](#module_motherboard..Component)</code>  
**Example**  
```js
CarouselComponent.options = {
      activeSlideClass: 'active'
  };
```
<a name="module_motherboard..Dispatcher"></a>
### motherboard~Dispatcher ⇐ <code>[Component](#module_motherboard..Component)</code>
The Dispatcher class is meant to be used as a base class for complex, multi-component logic. Dispatcher extensions handle cross-module communication between child Components. The scope of a Dispatcher should be limited to a discrete set of behaviors, e.g. an ajax-form that lives in a modal that needs to close the modal on success; if the modal is closed while the ajax-form is submitting, the ajax-form is aborted; etc.

**Kind**: inner class of <code>[motherboard](#module_motherboard)</code>  
**Extends:** <code>[Component](#module_motherboard..Component)</code>  
<a name="module_motherboard..Dispatcher+getComponent"></a>
#### dispatcher.getComponent(T) ⇒ <code>[Component](#module_motherboard..Component)</code> &#124; <code>null</code>
Returns the first child component instance of the specified type or `null` if none are found.

**Kind**: instance method of <code>[Dispatcher](#module_motherboard..Dispatcher)</code>  
**Returns**: <code>[Component](#module_motherboard..Component)</code> &#124; <code>null</code> - A component instance of type T.  

| Param | Type | Description |
| --- | --- | --- |
| T | <code>T</code> | A component type to search for. |

**Example**  
```js
<!-- given this markup -->
  <div data-dispatcher="ExampleDispatcher">
  
      <form data-component="FormComponent" id="first">
      </form>
  
      <form data-component="FormComponent" id="second">
      </form>
  
  </div>
```
**Example**  
```js
var exampleDispatcher = app.getDispatcher(ExampleDispatcher);
  exampleDispatcher.getComponent(FormComponent); // will return the FormComponent instance for the '#first' element
  exampleDispatcher.getComponents(FormComponent); // will return both FormComponent instances
  exampleDispatcher.getComponent(CarouselComponent); // will return `null`
```
