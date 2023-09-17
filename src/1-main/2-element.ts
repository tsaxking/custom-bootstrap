/**
 * Generic Node
 *
 * @typedef {CBS_Node}
 */
type CBS_Node = CBS_Element|Node|string;

// used in CBS_Element.components
/**
 * Generic NodeMap
 *
 * @typedef {CBS_NodeMap}
 */
type CBS_NodeMap = CBS_Node[];

// Passed into every CBS_Element constructor
/**
 * Generic options object
 *
 * @class CBS_Options
 * @typedef {CBS_Options}
 */
type CBS_Options = {
    /**
     * Classes to be added to the element
     *
     * @type {?string[]}
     */
    classes?: CBS_Class[];
    /**
     * Id to be added to the element
     *
     * @type {?string}
     */
    id?: string;
    /**
     * Attributes to be added to the element
     *
     * @type {?object}
     */
    attributes?: {
        [key: string]: string;
    }


    listeners?: {
        [key: string]: CBS_ListenerCallback;
    }
}

/**
 * Parameters used in padding/margin
 *
 * @typedef {CBS_PropertyMap}
 */
type CBS_PropertyMap = {
    // [key: string]: number|undefined;
    s?: number;
    e?: number;
    t?: number;
    b?: number;
    x?: number;
    y?: number;
    global?: number;
}

/**
 * Margin/Padding
 *
 * @typedef {CBS_Properties}
 */
type CBS_Properties = {
    padding: CBS_PropertyMap;
    margin: CBS_PropertyMap;
}


/**
 * Element container
 *
 * @class CBS_Element
 * @typedef {CBS_Element}
 * @extends {CustomBootstrap}
 */
class CBS_Element {
    /**
     * All templates for this class
     *
     * @static
     * @type {{ [key: string]: CBS_Element }}
     */
    static _templates: { [key: string]: CBS_Element } = {
        'default': new CBS_Element()
    };


    /**
     * Generates a class from the template
     * @deprecated
     * This is currently in progress and is not ready for use
     *
     * @todo // TODO: Finish this
     * 
     * @static
     * @param {string} type
     * @returns {new () => CBS_Element}
     */
    static classFromTemplate(type: string): new () => CBS_Element {
        const template = this.templates[type] || this.templates['default'];

        const constructor = template.constructor as new () => CBS_Element;

        const c = class extends constructor {
            constructor(...args: []) {
                super(...args);
            }
        }

        c.prototype.options = template.options;
        c.prototype.listeners = template.listeners;
        (c.prototype as CBS_Component).subcomponents = (template as CBS_Component).subcomponents;
        c.prototype.parameters = template.parameters;
        c.prototype._el = template._el.cloneNode(true) as HTMLElement;
        c.prototype._options = template._options;
        c.prototype._events = template._events;
        c.prototype._components = template._components;

        return c;
    }

    /**
     * Generates a premade template from a string
     *
     * @static
     * @param {string} type
     * @param {?CBS_Options} [options]
     * @returns {CBS_Element}
     */
    static fromTemplate(type: string, options?: CBS_Options): CBS_Element {
        const el = (this.templates[type] || this.templates['default']).clone(true);
        el.options = options || {};
        return el;
    }

    /**
     * All templates for this class
     *
     * @private
     * @static
     * @readonly
     * @type {{ [key: string]: CBS_Element }}
     */
    private static get templates(): { [key: string]: CBS_Element } {
        return this._templates;
    }

    /**
     * Adds a template to the class
     *
     * @public
     * @static
     * @param {string} type
     * @param {CBS_Element} template
     * @returns {boolean}
     */
    public static addTemplate(type: string, template: CBS_Element): boolean {
        if (template.constructor.name !== this.name) {
            throw new Error(`Template must be of type ${this.name}`);
        }


        if (this._templates[type]) return false;
        this._templates[type] = template;
        return true;
    }





    // default properties
    /**
     * Parameters (used in writing/reading)
     *
     * @type {CBS_Parameters}
     */
    private _parameters: CBS_Parameters = {};
    /**
     * The element this class represents
     *
     * @type {HTMLElement}
     */
    _el: HTMLElement = document.createElement('div');
    /**
     * All listeners for this element
     *
     * @type {CBS_Listener[]}
     */
    listeners: CBS_Listener[] = [];
    /**
     * All events and their respective callbacks (used in dispatching)
     *
     * @type {{ [key: string]: CBS_ListenerCallback }}
     */
    private _events: { [key: string]: CBS_ListenerCallback } = {};
    /**
     * All components
     *
     * @type {CBS_NodeMap}
     */
    private _components: CBS_NodeMap = [];
    /**
     * All options for this element
     *
     * @type {CBS_Options}
     */
    _options: CBS_Options = {};


    /**
     * Array of elements that are the immediate children of this element
     *
     * @readonly
     * @type {CBS_NodeMap}
     */
    get components(): CBS_NodeMap {
        return this._components;
    }











    // █▀▄ ▄▀▄ █▀▄ █▀▄ █ █▄ █ ▄▀     ▄▀▄ █▄ █ █▀▄    █▄ ▄█ ▄▀▄ █▀▄ ▄▀  █ █▄ █ 
    // █▀  █▀█ █▄▀ █▄▀ █ █ ▀█ ▀▄█    █▀█ █ ▀█ █▄▀    █ ▀ █ █▀█ █▀▄ ▀▄█ █ █ ▀█ 

    /**
     * Padding properties
     *
     * @type {CBS_PropertyMap}
     */
    private _padding: CBS_PropertyMap = {};
    /**
     * Margin properties
     *
     * @type {CBS_PropertyMap}
     */
    private _margin: CBS_PropertyMap = {};

    /**
     * Applies padding/margin to the element
     *
     * @private
     * @param {string} paddingOrMargin
     * @param {string} key
     * @param {(number|undefined)} value
     */
    private setPaddingOrMargin(paddingOrMargin: string, key: string, value: number|undefined) {
        const properties = [
            's',
            'e',
            't',
            'b',

            'x',
            'y'
        ];

        const set = (property: CBS_PropertyMap, key: string, value: number|undefined) => {
            const abbr: string = paddingOrMargin[0];

            this.el.classList.remove(`${abbr}-${property.global}`); // removes glbal property

            if (key === 'global') {
                for (const property in properties) {
                    this.el.classList.remove(`${abbr}${property}-${property[property]}`);

                    delete properties[property];
                }

                property.global = value;
                this.el.classList.add(`${abbr}-${value}`);
            } else {
                delete property.global;
                this.el.classList.remove(`${abbr}${key}-${property[key]}`); // removes the current property
                property[key] = value;
                this.el.classList.add(`${abbr}${key}-${value}`);
            }
        }

        switch (paddingOrMargin) {
            case 'padding':
                set(this._padding, key, value);
                break;
            case 'margin':
                set(this._margin, key, value);
                break;
        }
    }

    /**
     * Applies the full padding properties to the element
     *
     * @type {CBS_PropertyMap}
     */
    set allPadding(padding: CBS_PropertyMap) {
        this._padding = padding;

        if (padding.s) this.paddingS = padding.s;
        if (padding.e) this.paddingE = padding.e;
        if (padding.t) this.paddingT = padding.t;
        if (padding.b) this.paddingB = padding.b;
        if (padding.x) this.paddingX = padding.x;
        if (padding.y) this.paddingY = padding.y;
        if (padding.global) this.padding = padding.global;
    }

    /**
     * Full padding properties
     *
     * @type {CBS_PropertyMap}
     */
    get allPadding(): CBS_PropertyMap {
        return this._padding;
    }

    /**
     * Applies the full margin properties to the element
     *
     * @type {CBS_PropertyMap}
     */
    set allMargin(margin: CBS_PropertyMap) {
        this._margin = margin;

        if (margin.s) this.marginS = margin.s;
        if (margin.e) this.marginE = margin.e;
        if (margin.t) this.marginT = margin.t;
        if (margin.b) this.marginB = margin.b;
        if (margin.x) this.marginX = margin.x;
        if (margin.y) this.marginY = margin.y;
        if (margin.global) this.margin = margin.global;
    }

    /**
     * Full margin properties
     *
     * @type {CBS_PropertyMap}
     */
    get allMargin(): CBS_PropertyMap {
        return this._margin;
    }

    /**
     * Global padding
     *
     * @type {number}
     */
    set padding(value: number|undefined) {
        this.setPaddingOrMargin('padding', 'global', value);
    }

    /**
     * Padding x
     *
     * @type {number}
     */
    set paddingX(value: number|undefined) {
        this.setPaddingOrMargin('padding', 'x', value);
    }

    /**
     * Padding y
     *
     * @type {number}
     */
    set paddingY(value: number|undefined) {
        this.setPaddingOrMargin('padding', 'y', value);
    }

    /**
     * Padding Start
     *
     * @type {number}
     */
    set paddingS(value: number|undefined) {
        this.setPaddingOrMargin('padding', 's', value);
    }

    /**
     * Padding End
     *
     * @type {number}
     */
    set paddingE(value: number|undefined) {
        this.setPaddingOrMargin('padding', 'e', value);
    }

    /**
     * Padding Top
     *
     * @type {number}
     */
    set paddingT(value: number|undefined) {
        this.setPaddingOrMargin('padding', 't', value);
    }

    /**
     * Padding Bottom
     *
     * @type {number}
     */
    set paddingB(value: number|undefined) {
        this.setPaddingOrMargin('padding', 'b', value);
    }

    /**
     * Global margin
     *
     * @type {number}
     */
    set margin(value: number|undefined) {
        this.setPaddingOrMargin('margin', 'global', value);
    }

    /**
     * Margin x
     *
     * @type {number}
     */
    set marginX(value: number|undefined) {
        this.setPaddingOrMargin('margin', 'x', value);
    }

    /**
     * Margin y
     *
     * @type {number}
     */
    set marginY(value: number|undefined) {
        this.setPaddingOrMargin('margin', 'y', value);
    }

    /**
     * Margin Start
     *
     * @type {number}
     */
    set marginS(value: number|undefined) {
        this.setPaddingOrMargin('margin', 's', value);
    }

    /**
     * Margin End
     *
     * @type {number}
     */
    set marginE(value: number|undefined) {
        this.setPaddingOrMargin('margin', 'e', value);
    }

    /**
     * Margin Top
     *
     * @type {number}
     */
    set marginT(value: number|undefined) {
        this.setPaddingOrMargin('margin', 't', value);
    }

    /**
     * Margin Bottom
     *
     * @type {number}
     */
    set marginB(value: number|undefined) {
        this.setPaddingOrMargin('margin', 'b', value);
    }

    /**
     * Padding global
     *
     * @type {(number|undefined)}
     */
    get padding(): number|undefined {
        return this._padding.global;
    }

    /**
     * Padding x
     *
     * @type {(number|undefined)}
     */
    get paddingX(): number|undefined {
        return this._padding.x;
    }

    /**
     * Padding y
     *
     * @type {(number|undefined)}
     */
    get paddingY(): number|undefined {
        return this._padding.y;
    }

    /**
     * Padding Start
     *
     * @type {(number|undefined)}
     */
    get paddingS(): number|undefined {
        return this._padding.s;
    }

    /**
     * Padding End
     *
     * @type {(number|undefined)}
     */
    get paddingE(): number|undefined {
        return this._padding.e;
    }

    /**
     * Padding Top
     *
     * @type {(number|undefined)}
     */
    get paddingT(): number|undefined {
        return this._padding.t;
    }

    /**
     * Padding Bottom
     *
     * @type {(number|undefined)}
     */
    get paddingB(): number|undefined {
        return this._padding.b;
    }

    /**
     * Margin global
     *
     * @type {(number|undefined)}
     */
    get margin(): number|undefined {
        return this._margin.global;
    }

    /**
     * Margin x
     *
     * @type {(number|undefined)}
     */
    get marginX(): number|undefined {
        return this._margin.x;
    }

    /**
     * Margin y
     *
     * @type {(number|undefined)}
     */
    get marginY(): number|undefined {
        return this._margin.y;
    }

    /**
     * Margin Start
     *
     * @type {(number|undefined)}
     */
    get marginS(): number|undefined {
        return this._margin.s;
    }

    /**
     * Margin End
     *
     * @type {(number|undefined)}
     */
    get marginE(): number|undefined {
        return this._margin.e;
    }

    /**
     * Margin Top
     *
     * @type {(number|undefined)}
     */
    get marginT(): number|undefined {
        return this._margin.t;
    }







    // ▄▀▀ █ █ ▄▀▀ ▀█▀ ▄▀▄ █▄ ▄█    ██▀ █ █ ██▀ █▄ █ ▀█▀ ▄▀▀ 
    // ▀▄▄ ▀▄█ ▄█▀  █  ▀▄▀ █ ▀ █    █▄▄ ▀▄▀ █▄▄ █ ▀█  █  ▄█▀ 

    // custom events on all elements
    /**
     * All custom events for this element
     *
     * @type {string[]}
     */
    static _customEvents: string[] = [
        // DOM Events
        'el:change',
        'el:append',
        'el:remove',
        'el:hide',
        'el:show',
        'el:clone',
        'el:destroy',

        // Parameter Events
        'param:write',
        'param:read',

        // Option events
        'options:change'
    ];


    /**
     * Gets all custom events for this element
     *
     * @static
     * @type {string[]}
     */
    static get customEvents(): string[] {
        return this._customEvents;
    }

    /**
     * Sets all custom events for this element
     *
     * @static
     * @type {{}}
     */
    static set customEvents(events: string[]) {
        this._customEvents = events;
    }

    /**
     * Adds a single custom event to the prototype
     *
     * @static
     * @param {string} event
     */
    static addCustomEvent(event: string) {
        this._customEvents.push(event);
    }

    /**
     * Removes a single custom event from the prototype
     *
     * @static
     * @param {string} event
     */
    static removeCustomEvent(event: string) {
        this._customEvents = this.customEvents.filter(e => e !== event);
    }

    /**
     * Adds multiple custom events to the prototype
     *
     * @static
     * @param {...string[]} events
     */
    static addCustomEvents(...events: string[]) {
        this._customEvents.push(...events);
    }

    /**
     * Removes multiple custom events from the prototype
     *
     * @static
     * @param {...string[]} events
     */
    static removeCustomEvents(...events: string[]) {
        this._customEvents = this.customEvents.filter(e => !events.includes(e));
    }

    /**
     * Creates an instance of CBS_Element
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        // console.log('CBS_Element Constructor', JSON.stringify(options));

        this.options = options || {};
    }


    /**
     * Gets the options for this element
     *
     * @type {CBS_Options}
     */
    get options(): CBS_Options {
        return {
            classes: this.classes,
            attributes: this.attributes,
            id: this.id,
            listeners: this.listeners.reduce((acc, cur) => {
                acc[cur.event] = cur.callback;
                return acc;
            }, {} as { [key: string]: CBS_ListenerCallback })
        };
    }

    /**
     * Sets the options for this element and renders
     *
     * @type {CBS_Options}
     */
    set options(options: CBS_Options) {
        if (!this._el) return;
        const { classes, attributes, id } = options;
        this._options = options;

        if (classes) this.classes = classes;
        if (attributes) this.attributes = attributes;
        if (id) this.id = id;

        if (options?.listeners) {
            Object.entries(options.listeners).forEach(([event, callback]) => {
                this.on(event, callback);
            });
        }
    }

    /**
     * Gets the element this class represents
     *
     * @type {HTMLElement}
     */
    get el(): HTMLElement {
        return this._el;
    }

    /**
     * Sets the element this class represents
     * Also clears all elements
     * Also adds all events to the element
     * Also triggers the element:change event
     * Also renders the element
     * Also sets the padding and margin
     *
     * @type {HTMLElement}
     */
    set el(el: HTMLElement) {
        this.clearElements();

        this._el = el;
        this.options = this._options;
        this.allPadding = this.allPadding;
        this.allMargin = this.allMargin;

        // console.log('el set', this._el, this.options);

        Object.entries(this._events).forEach(([event, callback]) => {
            this._el.addEventListener(event, callback);
        });

        this.trigger('element.change');
    }

    /**
     * Element id
     * @date 8/26/2023
     *
     * @type {string}
     */
    _id: string = '';

    /**
     * Element id
     * @date 8/26/2023
     *
     * @type {string}
     */
    get id(): string {
        return this._id;
    }

    /**
     * Element id
     * @date 8/26/2023
     *
     * @type {string}
     */
    set id(id: string) {
        if (!this._el) return;
        this._id = id;
        this._el.id = id;
    }





    // ██▀ █   ██▀ █▄ ▄█ ██▀ █▄ █ ▀█▀ ▄▀▀ 
    // █▄▄ █▄▄ █▄▄ █ ▀ █ █▄▄ █ ▀█  █  ▄█▀ 


    /**
     * Appends an element to this element
     *
     * @param {...CBS_NodeMap} elements
     */
    append(...elements: CBS_NodeMap): this {
        elements.forEach(el => {
            if (el instanceof CBS_Element) {
                this._el.appendChild(el._el);
                el.render();

                el.parent = this;
            } else if (typeof el === 'string') {
                this._el.innerHTML += el;
            } else {
                this._el.appendChild(el);
            }
        });

        this._components.push(...elements);

        this.render();

        return this;
    }

    /**
     * Removes an element from this element
     *
     * @param {...CBS_NodeMap} elements
     */
    removeElement(...elements: CBS_NodeMap) {
        elements.forEach(el => {
            if (el instanceof CBS_Element) {
                this._el.removeChild(el._el);
                el.render();
                el.parent = null;
            } else if (typeof el === 'string') {
                this._el.innerHTML = this._el.innerHTML.replace(el, '');
            } else {
                this._el.removeChild(el);
            }
        });

        this._components = this._components.filter(e => !elements.includes(e));
    }

    /**
     * Appends an element at the start of this element
     *
     * @param {...CBS_NodeMap} elements
     */
    prepend(...elements: CBS_NodeMap) {
        elements.forEach(el => {
            if (el instanceof CBS_Element) {
                this._el.prepend(el._el);
                el.render();
                el.parent = this;
            } else if (typeof el === 'string') {
                this._el.innerHTML = el + this._el.innerHTML;
            } else {
                this._el.prepend(el);
            }
        });

        this._components.unshift(...elements);

        this.render();
    }

    /**
     * Replace an element with another element
     *
     * @param {CBS_Node} nodeToReplace
     * @param {...CBS_NodeMap} elementsToAdd
     */
    replace(nodeToReplace: CBS_Node, ...elementsToAdd: CBS_NodeMap) {
        if (this._components.includes(nodeToReplace)) {
            this.insertAfter(nodeToReplace, ...elementsToAdd);
            this.removeElement(nodeToReplace);
        }

        this.render();
    }

    /**
     * Inserts an element before another element
     *
     * @param {CBS_Node} nodeToInsertBefore
     * @param {...CBS_NodeMap} elementsToAdd
     */
    insertBefore(nodeToInsertBefore: CBS_Node, ...elementsToAdd: CBS_NodeMap) {
        if (this._components.includes(nodeToInsertBefore)) {
            const index = this._components.indexOf(nodeToInsertBefore);
            this._components.splice(index, 0, ...elementsToAdd);

            let node: CBS_Element|ChildNode;

            // adds elements to components
            if (nodeToInsertBefore instanceof CBS_Element) {
                node = nodeToInsertBefore._el;
            } else if (typeof nodeToInsertBefore === 'string') { 
                [node] = CBS.createElementFromText(nodeToInsertBefore);
            } else {
                node = nodeToInsertBefore as ChildNode;
            }

            // adds elements to the DOM
            elementsToAdd.forEach((el, i) => {
                if (el instanceof CBS_Element) {
                    this._el.insertBefore(el._el, (node instanceof CBS_Element) ? node._el : node);
                    el.render();
                    el.parent = this;
                } else if (typeof el === 'string') {
                    const div = document.createElement('div');
                    div.innerHTML = el;
                    this._el.insertBefore(div, (node instanceof CBS_Element) ? node._el : node);
                } else {
                    this._el.insertBefore(el, (node instanceof CBS_Element) ? node._el : node);
                }
            });
        }

        this.render();
    }

    /**
     * Inserts an element after another element
     *
     * @param {CBS_Node} nodeToInsertAfter
     * @param {...CBS_NodeMap} elementsToAdd
     */
    insertAfter(nodeToInsertAfter: CBS_Node, ...elementsToAdd: CBS_NodeMap) {
        if (this._components.includes(nodeToInsertAfter)) {
            const index = this._components.indexOf(nodeToInsertAfter);
            const nextNode = this._components[index + 1];

            if (nextNode) {
                this.insertBefore(nextNode, ...elementsToAdd);
            } else {
                this.append(...elementsToAdd);
            }
        }
    }

    /**
     * Injects an element at a specific index
     * @param {CBS_Node} index 
     * @param {CBS_NodeMap} elementsToAdd 
     */
    inject(index: number, ...elementsToAdd: CBS_NodeMap) {
        const node = this._components[index];

        if (node) {
            this.insertBefore(node, ...elementsToAdd);
        } else {
            this.append(...elementsToAdd);
        }
    }

    /**
     * Removes an element at a specific index and replaces it other element(s)
     * @param {Number} start 
     * @param {Number} deleteCount 
     * @param {...CBS_NodeMap} elementsToAdd 
     */
    splice(start: number, deleteCount: number, ...elementsToAdd: CBS_NodeMap) {
        const s = this._components[start];
        const e = this._components[start + deleteCount];

        if (s && e) {
            // removes all elements between start and end
            for (let i = start; i < start + deleteCount; i++) {
                this.removeElement(this._components[i]);
            }

            // s is the new index for the elements to be added
            this.inject(start, ...elementsToAdd);
        } else if (s) {
            // removes all elements between start and the end of the array
            for (let i = start; i < this._components.length; i++) {
                this.removeElement(this._components[i]);
            }

            // s is the new index for the elements to be added
            this.inject(start, ...elementsToAdd);
        } else {
            // appends all elements to the end of the array
            this.append(...elementsToAdd);
        }
    }

    /**
     * Description placeholder
     */
    clearElements() {
        this._components = [];
        this._el.innerHTML = '';

        this.trigger('element:clear');
    }


    /**
     * The parent of this element (if it exists)
     * @date 8/26/2023
     *
     * @private
     * @type {(CBS_Element|null)}
     */
    private _parent: CBS_Element|null = null;

    /**
     * Gets the parent of this element
     *
     * @readonly
     * @type {(HTMLElement|null)}
     */
    get parent(): CBS_Element|null {
        return this._parent;
    }

    /**
     * Gets the parent of this element
     */
    set parent(parent: CBS_Element|null) {
        this._parent = parent;
    }






    // █▀▄ ▄▀▄ █▀▄ ▄▀▄ █▄ ▄█ ██▀ ▀█▀ ██▀ █▀▄ ▄▀▀ 
    // █▀  █▀█ █▀▄ █▀█ █ ▀ █ █▄▄  █  █▄▄ █▀▄ ▄█▀ 

    /**
     * Creates all <span> and <div> to replace {{}} in the HTML
     */
    render() {        
        const isShallow = (el: Element): boolean => !el.children.length;

        if (this._el) {
            this._el.querySelectorAll('[data-cbs-replace]').forEach(e => {
                const replacement = document.createElement('div');
                replacement.dataset[`cbs-${this.constructor.name.toLowerCase()}`] = e.getAttribute('data-cbs-replace') || '';

                e.replaceWith(replacement);
            });

            const matches = Array.from(this._el.querySelectorAll('*')).filter(el => el.innerHTML.match(/{{.*}}/));

            matches.forEach(match => {
                if (isShallow(match)) {
                    const params = match.innerHTML.match(/{{.*}}/g);
                    params?.forEach(param => {
                        const key = param.replace(/[{}]/g, '');
                        const value = `<span data-cbs-${this.constructor.name.toLowerCase()}="${key}"></span>`;
                        match.innerHTML = match.innerHTML.replace(param, value);
                    });
                }
            });
        }

        this.writeAll();
    }
    
    /**
     * Writes a value to a parameter
     *
     * @param {string} key
     * @param {CBS_ParameterValue} value
     * @param {boolean} [trigger=true]
     */
    write(key: string, value: CBS_ParameterValue, trigger: boolean = true) {
        if (this._el) {
            this._el.querySelectorAll(`*[data-cbs-${this.constructor.name.toLowerCase()}="${key}"]`).forEach(el => {
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    el.innerHTML = value.toString();
                } else if (typeof value === 'undefined' || value === null) {
                    el.innerHTML = '';
                } else if (value instanceof HTMLElement) {
                    el.innerHTML = '';
                    el.appendChild(value);
                } else if (value instanceof CBS_Element) {
                    while (el.firstChild) {
                        el.removeChild(el.firstChild);
                    }
                    el.appendChild(value.el);
                } else {
                    console.error('Invalid value type', value);
                }
            });

            this.parameters[key] = value;

            this.trigger(`parameter.write:${key}`);
            if (trigger) this.trigger('parameters.write');

            for (const c of this.components) {
                if (c instanceof CBS_Element) c.write(key, value, trigger);
            }
        }
    }

    /**
     * Reads a parameter
     * @deprecated
     * I don't think this is useful at all
     *
     * @param {string} param
     * @param {boolean} [asHTML=false]
     * @returns {CBS_ParameterValue[]}
     */
    read(param: string, asHTML:boolean = false): CBS_ParameterValue[] {
        if (this._el) {
            this.trigger('parameter.read');

            const arr = Array.from(this._el.querySelectorAll(`[data-cbs-${this.constructor.name}="${param}"]`));
            if (asHTML) return arr.map(el => el.children[0] || el);
            return arr.map(el => el.innerHTML);
        }
        return [];
    }

    /**
     * Gets all parameters
     *
     * @type {CBS_Parameters}
     */
    get parameters(): CBS_Parameters {
        return this._parameters;
    }

    /**
     * Sets all parameters and writs them to the element
     *
     * @type {CBS_Parameters}
     */
    set parameters(params: CBS_Parameters) {
        this._parameters = params;
    }

    /**
     * Writes all parameters to the element
     */
    writeAll() {
        Object.entries(this.parameters).forEach(([key, value]) => {
            this.write(key, value, false);
        });

        this.trigger('parameters.write');
    }



















    // █   █ ▄▀▀ ▀█▀ ██▀ █▄ █ ██▀ █▀▄ ▄▀▀ 
    // █▄▄ █ ▄█▀  █  █▄▄ █ ▀█ █▄▄ █▀▄ ▄█▀ 

    /**
     * Adds a listener to the element
     *
     * @param {string} event
     * @param {CBS_ListenerCallback} callback
     * @param {boolean} [isAsync=false]
     */
    on(event: string, callback: CBS_ListenerCallback, isAsync: boolean = true): this {
        if (!this._el) throw new Error('No element to add listener to');
        // if (!event && !callback) {
        //     reset all .off() listeners
        // }
        // if (options && typeof options !== 'object') throw new Error('Options must be an object');

        const errCallback = async(e: Event): Promise<boolean> => {
            return new Promise(async (res, rej) => {
                let success = true;
                const listeners = this.listeners.filter(l => l.event === event);

                const promises = listeners.filter(l => l.isAsync).map(async l => l.callback(e)?.catch((err: Error) => {
                    success = false;
                    console.error(err);
                }));

                for (const listener of listeners.filter(l => !l.isAsync)) {
                    try {
                        await listener.callback(e);
                    } catch (err) {
                        success = false;
                        console.error(err);
                    }
                }

                await Promise.all(promises);

                res(success);
            });
        }

        this.listeners.push(new CBS_Listener(event, callback, isAsync));

        if (!this.hasListener(event)) {
            this._events[event] = errCallback;
            this._el.addEventListener(event, errCallback);
        }

        return this;
    }

    /**
     * If the element has a listener for the event
     *
     * @param {string} event
     * @returns {boolean}
     */
    hasListener(event: string): boolean {
        return !!this._events[event];
    }

    /**
     * Removes a listener from the element
     *
     * @param {?string} [event]
     * @param {?CBS_ListenerCallback} [callback]
     */
    off(event?: string, callback?: CBS_ListenerCallback) {
        if (!this._el) throw new Error('No element to remove event listener from');

        if (!event) {
            this.listeners = [];
            Object.entries(this._events).forEach(([event, cb]) => {
                this._el.removeEventListener(event, cb);
            });
            this._events = {};
            return;
        }

        if (typeof event !== 'string') throw new Error('event must be a string, received ' + typeof event);

        if (!callback) {
            this.listeners = this.listeners.filter(listener => listener.event !== event);
            return;
        }

        if (typeof callback !== 'function') throw new Error('callback must be a function, received ' + typeof callback);

        // if (!options) {
            this.listeners = this.listeners.filter(listener => listener.event !== event || listener.callback !== callback);
            // return;
        // }

        // if (typeof options !== 'object') throw new Error('options must be an object, received ' + typeof options);

        // this.el.removeEventListener(event, callback, options);
        // this.listeners = this.listeners.filter(listener => listener.event !== event || listener.callback !== callback);

        if (!this.listeners.filter(listener => listener.event === event).length) {
            this._el.removeEventListener(event, this._events[event]);
            delete this._events[event];
        }
    }

    /**
     * Triggers an event on the element (same as dispatch event)
     *
     * @async
     * @param {string} event
     * @param {?EventInit} [options]
     * @returns {Promise<boolean>}
     */
    async trigger(event: string, options?: EventInit): Promise<boolean> {
        return new Promise((res,rej) => {
            if (!this._el) throw new Error('No element to trigger event on');

            if (typeof event !== 'string') throw new Error('event must be a string, received ' + typeof event);

            if (this.constructor.prototype._customEvents?.includes(event)) {
                const e = new CustomEvent(event, {
                    ...(options || {}),
                    detail: {
                        name: this.constructor.name + ':' + event,
                        element: this.el
                    }
                });
                return this.el.dispatchEvent(e);
            } else {
                const e = new Event(event, options);
                return this.el.dispatchEvent(e);
            }
        });
    }



        
    // ▄▀  ██▀ █▄ █ ██▀ █▀▄ ▄▀▄ █      █▄ ▄█ ██▀ ▀█▀ █▄█ ▄▀▄ █▀▄ ▄▀▀ 
    // ▀▄█ █▄▄ █ ▀█ █▄▄ █▀▄ █▀█ █▄▄    █ ▀ █ █▄▄  █  █ █ ▀▄▀ █▄▀ ▄█▀ 


    /**
     * Hides the element (adds d-none class)
     */
    hide() {
        this._el.classList.add('d-none');

        this.trigger('el.hide');
    }

    /**
     * Shows the element (removes d-none class)
     */
    show() {
        this._el.classList.remove('d-none');

        this.trigger('el.show');
    }

    /**
     * Tests if the element is hidden (has the d-none class)
     */
    get isHidden() {
        return this._el.classList.contains('d-none');
    }

    /**
     * Toggles the d-none class
     */
    toggleHide() {
        this._el.classList.toggle('d-none');
    }

    /**
     * Removes the element from the DOM
     */
    destroy() {
        this.trigger('el.destroy');

        this.parent?.removeElement(this);

        this.off();
        for (const c of this.components) {
            if (c instanceof CBS_Element) c.destroy();
        }
        this._el.remove();
    }




    /**
     * Clones this 
     * @param {Boolean} listeners Whether or not to clone all listeners (default: true)
     * @returns {CBS_Element} A clone of this
     */
    clone(listeners: boolean = true): CBS_Element {
        // this will probably need to be changed for every extension of this class

        const constructor = this.constructor as new (options?: CBS_Options) => CBS_Element;

        const clone = new constructor(this.options);

        clone._el = this._el.cloneNode(true) as HTMLElement;

        // clones all listeners too
        if (listeners) {
            for (const event of this.listeners) {
                clone.on(event.event, event.callback);
            }
        }

        this.trigger('el.clone');

        return clone;
    }



















    // ▄▀▀ █   ▄▀▄ ▄▀▀ ▄▀▀ ██▀ ▄▀▀ 
    // ▀▄▄ █▄▄ █▀█ ▄█▀ ▄█▀ █▄▄ ▄█▀ 

    /**
     * Adds classes to the element
     *
     * @param {...string[]} classes
     */
    addClass(...classes: CBS_Class[]) {
        if (!this._options.classes) this._options.classes = [];

        this._options.classes = [...this._options.classes, ...classes];
        this.el.classList.add(...classes);
    }

    /**
     * Removes classes from the element
     *
     * @param {...string[]} classes
     */
    removeClass(...classes: CBS_Class[]) {
        if (!this._options.classes) this._options.classes = [];

        this._options.classes = this._options.classes.filter(c => !classes.includes(c));
        this.el.classList.remove(...classes);
    }

    /**
     * Toggles classes on the element
     *
     * @param {...string[]} classes
     */
    toggleClass(...classes: CBS_Class[]) {
        if (!this._options.classes) this._options.classes = [];

        this._options.classes = this._options.classes.filter(c => !classes.includes(c));
        for (const c of classes) {
            this.el.classList.toggle(c);
        }
    }

    /**
     * Gets all classes on the element
     *
     * @readonly
     * @type {string[]}
     */
    get classes(): CBS_Class[] {
        return Array.from(this.el.classList) as CBS_Class[];
    }


    /**
     * Replaces all classes on the element
     */
    set classes(classes: CBS_Class[]) {
        this.clearClasses();
        this.addClass(...classes);
    }

    /**
     * Deletes all classes on the element
     * @date 8/26/2023
     */
    clearClasses() {
        this.el.classList.remove(...this.classes);
    }

    /**
     * Returns true if the element has all classes
     *
     * @param {string} name
     * @returns {*}
     */
    hasClass(...name: string[]): any {
        return name.every(c => this.el.classList.contains(c));
    }




    // ▄▀▀ ▀█▀ ▀▄▀ █   ██▀ 
    // ▄█▀  █   █  █▄▄ █▄▄ 


    // /**
    //  * 
    //  * @date 8/26/2023
    //  *
    //  * @type {CSSStyleDeclaration}
    //  */
    // get style(): CSSStyleDeclaration {
    //     return this.el.style;
    // }

    // /**
    //  * 
    //  * @date 8/26/2023
    //  *
    //  * @type {CSSStyleDeclaration}
    //  */
    // set style(style: object) {
    //     for (const [key, value] of Object.entries(style)) {
    //         this.el.style[key] = value;
    //     }
    // }



    // ▄▀▄ ▀█▀ ▀█▀ █▀▄ █ ██▄ █ █ ▀█▀ ██▀ ▄▀▀ 
    // █▀█  █   █  █▀▄ █ █▄█ ▀▄█  █  █▄▄ ▄█▀ 

    /**
     * Attributes on the element
     * @date 8/26/2023
     *
     * @type 
     */
    private _attributes: {
        [key: string]: string;
    } = {};

    /**
     * Adds an attribute to the element
     *
     * @param {string} name
     * @param {string} value
     */
    setAttribute(name: string, value: string) {
        this._el.setAttribute(name, value);
        this._attributes[name] = value;
    }

    /**
     * Removes an attribute from the element
     *
     * @param {string} name
     */
    removeAttribute(name: string) {
        this._el.removeAttribute(name);
        delete this._attributes[name];
    }


    /**
     * Returns true if the element has the attribute
     *
     * @param {string} name
     * @returns {string}
     */
    getAttribute(name: string): string {
        return this._attributes[name];
    }

    /**
     * Clears all attributes on the element
     * @date 8/26/2023
     */
    clearAttributes() {
        for (const key in Object.keys(this._attributes)) {
            this.removeAttribute(key);
        }
    }

    /**
     * Attributes on the element
     * @date 8/26/2023
     *
     * @type {{ [key: string]: string }}
     */
    get attributes(): { [key: string]: string } {
        return this._attributes;
    }

    /**
     * Replaces all attributes on the element
     * @date 8/26/2023
     *
     * @type {{ [key: string]: string; }}
     */
    set attributes(attributes: { [key: string]: string }) {
        this.clearAttributes();
        this._attributes = attributes;

        for (const key in attributes) {
            this.setAttribute(key, attributes[key]);
        }
    }








    // ██▀ █ █ ██▀ █▄ █ ▀█▀ ▄▀▀ 
    // █▄▄ ▀▄▀ █▄▄ █ ▀█  █  ▄█▀ 

    /**
     * Given click/touch event, it returns the x and y coordinates of the event on the element
     *
     * @param {(MouseEvent|TouchEvent)} e
     * @returns {{ x: number; y: number; }}
     */
    getXY(e: MouseEvent|TouchEvent): { x: number; y: number; } {
        if ((e as TouchEvent).touches) {
            return {
                x: (e as TouchEvent).touches[0].clientX,
                y: (e as TouchEvent).touches[0].clientY
            }
        } else {
            return {
                x: (e as MouseEvent).clientX,
                y: (e as MouseEvent).clientY
            }
        }
    }

    /**
     * Given a touch event, it returns the x and y coordinates of all touches on the element in order
     *
     * @param {TouchEvent} e
     * @returns {*}
     */
    getXYList(e: TouchEvent): { x: number; y: number; }[] {
        return Array.from((e as TouchEvent).touches).map(t => {
            return {
                x: t.clientX,
                y: t.clientY
            }
        });
    }







    // ▄▀▀ ▄▀▄ █   ▄▀▄ █▀▄ 
    // ▀▄▄ ▀▄▀ █▄▄ ▀▄▀ █▀▄ 

    /**
     * Background color of the element
     *
     * @type {(CBS_Color|undefined)}
     */
    private _background: CBS_Color|undefined;

    /**
     * Background color of the element
     *
     * @type {*}
     */
    set background(color: CBS_Color|undefined) {
        if (this.background) this.removeClass(`bg-${this.background}`);
        this._background = color;
        if (color) this.addClass(`bg-${color}`);
    }

    /**
     * Background color of the element
     *
     * @type {(CBS_Color|undefined)}
     */
    get background(): CBS_Color|undefined {
        return this._background;
    }

    /**
     * Inner html of the element
     * @date 8/26/2023
     *
     * @type {string}
     */
    get html() {
        return this.el.innerHTML;
    }

    /**
     * Inner html of the element
     * @date 8/26/2023
     *
     * @type {string}
     */
    set html(text: string) {
        const els = CBS.createElementFromText(text);
        this.clearElements();
        this.append(...els);
    }

    /**
     * The content of the element
     * @date 8/26/2023
     *
     * @type {CBS_NodeMap}
     */
    get content(): CBS_NodeMap {
        return this.components;
    }

    /**
     * The content of the element
     * @date 8/26/2023
     *
     * @type {*}
     */
    set content(content: CBS_Node|CBS_NodeMap) {
        this.clearElements();
        if (Array.isArray(content)) this.append(...content);
        else this.append(content);
    }
};