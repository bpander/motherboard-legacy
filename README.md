# motherboard

Motherboard is a small, extensible boilerplate for client-side JavaScript applications. It's designed to make common architecture issues (separation of concerns, cross-module communication) easier to handle and common tasks (querying elements, binding events) more concise (read less tedious).

## Installation
`bower install motherboard --save`

## Getting Started
A set of base classes.

### Differences from MVC Frameworks

#### Addresses Complex UI behaviors
Angular, React, and similar frameworks are good for RESTful applications (updating views as data changes). What they don't seem to address is complex behaviors between UI components, e.g. clicking a button causes a specific panel on a specific accordion to expand and navigate an inner carousel to a specific slide. Motherboard is meant to make coordinating between disparate components easy.

#### Not monolithic
Motherboard is meant to be a foundation to build on. As such, it doesn't force a specific Router or templating engine on you. You can use whatever components fit your project, and if one stops being good, you can easily swap it out for a different (better) one.

## Examples
### Querying elements
```html
<div class="DemoComponent">
  <div data-tag="DemoComponent:foo"></div>
  <div data-tag="DemoComponent:foo"></div>
</div>
```
```javascript
// DemoComponent.js
this.findWithTag('DemoComponent:foo'); // Returns the first element found or null
this.findAllWithTag('DemoComponent:foo'); // Returns all elements found as a NodeList
```

### Referencing child components
```html
<div data-dispatcher="SomeDispatcher">
  <div data-component="DemoComponent"></div>
  <div data-component="DemoComponent"></div>
</div>
```
```javascript
// SomeDispatcher.js
this.getComponent(DemoComponent); // Returns first instance found or null
this.getComponents(DemoComponent); // Returns an array of all DemoComponent instances within the SomeDispatcher element
```

### Binding events
```javascript
this.createBinding(this.element, 'submit', _handleSubmit);
this.createBinding(this.getComponent(FormComponent), FormComponent.EVENT.SUBMIT, _handleSubmit);
this.enable(); // Enables all bindings
this.disable(); // Disables all bindings
```

### Triggering Custom Events
```javascript
// FormComponent.js
this.emit(FormComponent.EVENT.SUBMIT, { request: request });
```