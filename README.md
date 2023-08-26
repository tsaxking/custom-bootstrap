# cbs-bootstrap
Hello, and welcome to Custom Bootstrap! This is a resource for developers who use Bootstrap (5.0+) and would like a framework to manage elements.

## Basics
When you import this package into your DOM, you will be given a global constant `CBS` (Custom Bootstrap) which is an instance of `CustomBootstrap`. This constant is the equivalent of `document` in the DOM, it allows you to make elements and manage them.




## `CBS_Element`
A CBS_Element a wrapper around DOM elements where each instance of this class has a `.el` property that is the DOM element that instance represents. Here is the functionality this class provides:

<hr>

### General
`(CBS_Element).el: HTMLElement` - The element this class instance represents
- If changed, this will apply every `Listener` and property from `.options` onto the new element.
- Runs `.trigger('element.change')`

`(CBS_Element).options: {}` - Options containing `.classes`, `.id`, `.attributes`, and `.style`, along with more depending on the extended class. Used to change many aspects of a class in a quick and efficient manner.

`(CBS_Element).id: string` - Id of the object

`(CBS_Element).createElementFromText(html)` - Returns an array of all `HTMLElement`s, or `CBS_Element`s created from an html string. See [usage](#cbscreateelementfromtexthtml-string)
- html: `string`

`(CBS_Element).hide()` - Adds `d-none` to classes

`(CBS_Element).show()` - Removes `d-none` from classes

`(CBS_Element).toggleHide()` - Toggles `d-none`

`(CBS_Element).isHidden: boolean` - Whether the classes contains `d-none`

`(CBS_Element).destroy()` - removes event listeners, destroys all components, and runs `.el.remove()`

`(CBS_Element).clone()` - Clones the element

`(CBS_Element).clone(listeners)` - Clones the element
- listeners: `boolean` - (default: `true`) clones with the listeners



<hr>

### Elements

`(CBS_Element).el: HTMLElement` The element `CBS_Element` represents

Just for ease, I'll use `CBS_Node` to represent `Node|CBS_Element|String|Boolean|Number`

`get .content: CBS_Node[]` - Array of components that were appended to `.el`

`set .content: CBS_Node` - Removes all elements and replaces it with a single one

`set .content: CBS_Node[]` - Removes all elements and replaces them with several (in order)

`(CBS_Element).append(...element)` - adds element(s) onto `.el` in order
- element: `CBS_Node`

`(CBS_Element).removeElement(...element)` - removes element(s) from `.el`
- element: `CBS_Node`

`(CBS_Element).prepend(...element)` - prepends elements (in order) before the first element
- element: `CBS_Node`

`(CBS_Element).replace(nodeToReplace, ...elementsToAdd)` - replaces a node with one/multiple
- nodeToReplace: `CBS_Node`
- elementsToAdd: `CBS_Node`

`(CBS_Element).insertBefore(nodeToInsertBefore, ...elementsToAdd)` - inserts multiple/one nodes before another node
- nodeToReplace: `CBS_Node`
- elementsToAdd: `CBS_Node`

`(CBS_Element).insertAfter(nodeToInsertAfter, ...elementsToAdd)` - inserts multiple/one nodes after another node

`(CBS_Element).parent: Node` - The parent of this element

<hr>

### Listeners
Instead of `.addEventListener()` and `.removeEventListener()`, this uses `.on()` and `.off()`

`(CBS_Element).listeners: Listener[]` - The list of event listeners that this element has

`(CBS_Element).on(event, callback)` - adds an event listener
- event: `string`
- callback: `(event: Event) => {}`

`(CBS_Element).on(event, callback, isAsync)` - adds an event listener
- event: `string`
- callback: `(event: Event) => {}`
- isAsync: `boolean` (default: `true`) - Whether this function should be run in async/sync

`(CBS_Element).hasListener(event)` - returns whether this element has a listener of that name
- event: `string`
- returns: `boolean`

`(CBS_Element).off()` - removes all event listeners

`(CBS_Element).off(event)` - removes all events with that name
- event: `string`

`(CBS_Element).off(event, callback)` - removes all event listeners with that name and callback
- event: `string`
- callback: `(event: Event) => {}`

`(CBS_Element).trigger(event)` - triggers an event
- event: `string`
- returns: `Promise<boolean>` true if there was no error
<hr>

### Classes
`(CBS_Element).addClass(...classes)` - Adds classes to `.options` and to classes
- classes: `string`

`(CBS_Element).removeClass(...classes)` - Removes classes from `.options` and from classes
- classes: `string`

`(CBS_Element).toggleClass(...classes)` - Toggles classes in `.options` and in classes
- classes: `string`

`(CBS_Element).classes: string[]` - Array of classes from `.el`

`(CBS_Element).clearClasses()` - Removes all classes

`(CBS_Element).hasClass(...name)` - Whether the element has that class
- name: `string`
- returns: `boolean`

<hr>

### Parameters
Parameters allow you to edit multiple parts of a `CBS_Element` at once from one method. This is very useful when used in tandem with `CBS.createElementFromText()`

`(CBS_Element).parameters: { [key: string]: Node|CBS_Element|String|Boolean|Number }` - Key/value pairs for writable parameters on the object

`(CBS_Element).write(key, value)` - Writes that key/value pair onto the element and subElements
- key: `string`
- value: `Node|CBS_Element|String|Boolean|Number`

`(CBS_Element).write(key, value, trigger)` - Writes that key/value pair onto the element and subElements
- key: `string`
- value: `Node|CBS_Element|String|Boolean|Number`
- trigger: `boolean` - (default: `true`) Will run `.trigger('parameters.write')`

<hr>

### Padding and Margin
Utilizing Bootstrap's `p-#` and `m-#` classes, CBS_Element contains the following properties:

`(CBS_Element).paddingS`: - Padding Start

`(CBS_Element).paddingE`: - Padding End

`(CBS_Element).paddingT`: - Padding Top

`(CBS_Element).paddingB`: - Padding Bottom

`(CBS_Element).paddingX`: - Padding X

`(CBS_Element).paddingY`: - Padding Y

`(CBS_Element).padding`: - Global Padding (deletes all other `.padding[value]` properties)

`(CBS_Element).marginS`: - Margin Start

`(CBS_Element).marginE`: - Margin End

`(CBS_Element).marginT`: - Margin Top

`(CBS_Element).marginB`: - Margin Bottom

`(CBS_Element).marginX`: - Margin X

`(CBS_Element).marginY`: - Margin Y

`(CBS_Element).margin`: - Global Margin (deletes all other `.margin[value]` properties)

<hr>

## `CBS_Component`
This is extended off of `CBS_Element` so it keeps all properties above. Similar with `CBS_Element` this only represents a single DOM element, however, it has the property `.subcomponents` which is an object with `CBS_Element|CBS_Component`.

The property `.subcomponents` is useful for Bootstrap elements that require multiple elements, such as cards. For example:
```html
<div class="card">
    <div class="card-header">
        This would be CBS_Card.subcomponents.header (CBS_CardHeader)
        <h3 class="card-title">
            My card title
        <h3>
    </div>
    <div class="card-body">
        This would be CBS_Card.subcomponents.body (CBS_CardBody)
    </div>
    <div class="card-footer">
        This would be CBS_Card.subcomponents.footer (CBS_CardFooter)
    </div>
</div>
```


## Usage

### `CBS.createElementFromText(html: string)`

Create several references to elements in a string. (These will always be in the order that `document.querySelectorAll('*')` will return)
```typescript
const [div, p] = CBS.createElementFromString(`
    <div class="m-5">
        <p>Hello world!</p>
    </div>
`);

// references are kept:
div // <div class="m-5"><p>Hello world!</p></div>
p // <p>Hello world!</p>
```

Create `CBS_Element`s or `CBS_Component`s
```typescript
const [card, h5, p] = CBS.createElementFromString(`
    <cbs-card>
        <card-header> // CBS_Card.subcomponents.header
            <h5>My Card Title!</h5>
        </card-header>
        <card-body> // CBS_Card.subcomponents.body
            <p>My card body!</p>
        </card-body>
    </cbs-card>
`); 

// references:
card // CBS_Card
h5 // <h5>My Card Title!</h5>
p // <p>My card body!</p>
```

Very useful with parameters:
```typescript
const [card, h5] = CBS.createElementFromString(`
    <cbs-card>
        <card-header> 
            <h5>What time is it?</h5>
        </card-header>
        <card-body>
            {{time}} // this will not be visible until you write something
        </card-body>
    </cbs-card>
`);
card.write(new Date().toTimeString()); // will replace all {{time}} with this string
```
Similar to React, you can only create one element, if you want to make multiple, use blank tags
```typescript
const [, p, h5] = CBS.createElementFromString(`
    <>
        <p></p>
        <h5></h5>
    </>
`);
```


## Links
- [Main](./markdowns/main.md)
- [Elements](./markdowns/elements.md)