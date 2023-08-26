# CustomBootstrap Properties and Methods

## Static
`(CBS_Element).getAllParentNodes(element: HTMLElement): HTMLElement[]` - Returns an array of all parent nodes of an element, not including the element itself

`CBS.newID(): string` - Returns a unique id not used by any `CBS_Element`

## Prototype
`CBS.createElement(name: string, options?: CBS_Options): CBS_Element` - Creates an element with the given name and options

`CBS.addElement(name: string, constructor: new (options?: CBS_Options) => CBS_Element)` - Adds new elements to `CBS`

`CBS.createElementFromText(html: string): (CBS_ELement|HTMLElement)[]` - Generates an array of references to elements inside a string. The first element being the top-level element

`CBS.alert(message: string): Promise<void>` - Replacement for `window.alert(message: string)` using a modal and a promise

`CBS.confirm(message: string): Promise<boolean>` - Replacement for `window.confirm(message: string)` using a modal and a promise with a return value

`CBS.modalForm(form: CBS_Form): Promise<any>` - Pass a form into a modal and once submitted, the result will be `CBS_Form.value`

`CBS.prompt(message?: string): Promise<string|null>` - Returns a promise that resolves to the value of the input if the user clicks Okay, null if the user clicks Cancel


## Links
- [Home](../README.md)
- [Elements](./elements.md)