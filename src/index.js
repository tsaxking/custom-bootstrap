"use strict";
/**
 * Container for all of the CustomBootstrap library
 *
 * @class CustomBootstrap
 * @typedef {CustomBootstrap}
 */
class CustomBootstrap {
    static ids = [];
    static getAllParentNodes(el) {
        const nodeList = [];
        let prevLength = nodeList.length;
        while (prevLength === nodeList.length) {
            if (el.parentElement)
                nodeList.push(el.parentElement);
            prevLength = nodeList.length;
        }
        return nodeList;
    }
    static newID() {
        let id;
        do {
            id = 'cbs-' + Math.random().toString(36).substring(2, 9);
        } while (CustomBootstrap.ids.includes(id));
        CustomBootstrap.ids.push(id);
        return id;
    }
    /**
     * Parses a string into a selector object
     *
     * @static
     * @param {string} selector
     * @returns {Selector}
     */
    static parseSelector(selector) {
        selector = selector.trim();
        const getTag = (selector) => {
            // get first word (before ., #, or [])
            const tag = selector.match(/^[^.#[]+/);
            return tag ? tag[0] : '';
        };
        const getId = (selector) => {
            // get id (after #, and before . or [ or end of string)
            const id = selector.match(/#[^.#[\]]+/);
            return id ? id[0].substring(1) : '';
        };
        const getClasses = (selector) => {
            // get classes (after ., and before # or [ or end of string)
            const classes = selector.match(/\.[^.#[\]]+/g);
            return classes ? classes.map(c => c.substring(1)) : [];
        };
        const getAttributes = (selector) => {
            // get attributes (after [, and before ] or end of string)
            const attributes = selector.match(/\[[^\]]+\]/g);
            if (!attributes)
                return {};
            const result = {};
            attributes.forEach(a => {
                const parts = a.substring(1, a.length - 1).split('=');
                result[parts[0]] = parts[1];
            });
            return result;
        };
        return {
            tag: getTag(selector),
            id: getId(selector),
            classes: getClasses(selector),
            attributes: getAttributes(selector)
        };
    }
    // all of these are added when the constructor is created, so I commented them out
    // However, I may want to change this and I don't want to rewrite all of this
    /**
     * Elements contained in the CustomBootstrap library
     *
     * @type {CBS_ElementConstructorMap}
     */
    #elements = {};
    /**
     * Adds an element to the CustomBootstrap library
     *
     * @param {string} name
     * @param {new (options?: CBS_Options) => CBS_Element} element
     * @returns {(CBS_Element) => void}
     */
    addElement(name, element) {
        this.#elements[name] = element;
    }
    createElement(selector, options) {
        const { tag, id, classes, attributes } = CustomBootstrap.parseSelector(selector);
        options = {
            classes: [
                ...(classes || []),
                ...(options?.classes || [])
            ],
            id: id || options?.id,
            attributes: {
                ...(options?.attributes || {}),
                ...(attributes || {})
            }
        };
        const element = this.#elements[tag];
        if (!element) {
            const err = new Error('Element not found: ' + tag + ' Returning a CBS_Element instead');
            console.warn(err);
            return new CBS_Element(options);
        }
        return new element(options);
    }
    /**
     * Creates an element from an html string
     *
     * @param {string} text
     * @returns {(ChildNode|null)}
     */
    createElementFromText(text) {
        const div = document.createElement('div');
        div.innerHTML = text;
        const fullArray = Array.from(div.querySelectorAll('*'));
        const collected = [];
        return fullArray.map((el) => {
            // console.log(el);
            const tag = el.tagName.toLowerCase();
            if (tag.includes('cbs-')) {
                const [, element] = tag.split('cbs-');
                let cbsEl = CBS.createElement(element);
                // if ((el as HTMLElement).dataset.template) {
                //     cbsEl = cbsEl.constructor.fromTemplate((el as HTMLElement).dataset.template);
                // }
                // defining properties
                Array.from(el.attributes).forEach((attr) => {
                    cbsEl.setAttribute(attr.name, attr.value);
                });
                cbsEl.addClass(...Array.from(el.classList));
                cbsEl.style = Object.keys(el.style).reduce((acc, key) => {
                    if (!el.style[key])
                        return acc;
                    acc[key] = el.style[key];
                    return acc;
                }, {});
                if (cbsEl instanceof CBS_Component) {
                    Object.keys(cbsEl.subcomponents).forEach(name => {
                        const subEl = el.querySelector(`${element}-${name}`);
                        // console.log(name, subEl);
                        if (subEl) {
                            // console.log(subEl);
                            // get all text nodes and children in correct order
                            const textNodes = Array.from(subEl.childNodes).filter(n => n.nodeType === 3);
                            const children = Array.from(subEl.childNodes).filter(n => n.nodeType !== 3);
                            const subElements = [...textNodes, ...children];
                            subElements.sort((a, b) => {
                                if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING) {
                                    return 1;
                                }
                                else {
                                    return -1;
                                }
                            });
                            cbsEl.subcomponents[name].el.append(...subElements);
                            collected.push(subEl);
                        }
                        else {
                            try {
                                cbsEl.removeElement(cbsEl.subcomponents[name]);
                            }
                            catch (e) {
                                console.error(e);
                            }
                        }
                    });
                }
                el.replaceWith(cbsEl.el);
                return cbsEl;
            }
            return el;
        }).filter(e => (e && !collected.includes(e)));
    }
    /**
     * Replacement for alert() that uses modals
     * Returns a promise that resolves when the modal is closed
     *
     * @async
     * @param {*} message
     * @returns {Promise<void>}
     */
    async alert(message) {
        return new Promise((res, rej) => {
            const ok = new CBS_Button({
                color: 'primary'
            });
            ok.content = 'Okay';
            const modal = new CBS_Modal({
                buttons: [
                    ok
                ]
            });
            modal.title = 'Alert';
            modal.subcomponents.body.append(message);
            modal.subcomponents.footer.append(ok);
            ok.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res();
            });
            modal.on('hidden.bs.modal', () => res());
            modal.on('destroyed', () => res());
            modal.show();
        });
    }
    /**
     * Replacement for confirm() that uses modals
     * Returns a promise that resolves to true if the user clicks Okay, false if the user clicks Cancel
     *
     * @async
     * @param {*} message
     * @returns {Promise<boolean>}
     */
    async confirm(message) {
        return new Promise((res, rej) => {
            const yes = new CBS_Button({
                color: 'primary'
            });
            yes.content = 'Okay';
            const no = new CBS_Button({
                color: 'secondary'
            });
            no.content = 'Cancel';
            const modal = new CBS_Modal({
                buttons: [
                    yes,
                    no
                ]
            });
            modal.title = 'Confirm';
            modal.subcomponents.body.append(message);
            yes.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(true);
            });
            no.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(false);
            });
            modal.footer.append(yes, no);
            modal.on('hidden.bs.modal', () => res(false));
            modal.on('destroyed', () => res(false));
            modal.show();
        });
    }
    /**
     * Returns a promise that resolves to the value of the form input if the user clicks Submit, null if the user clicks Cancel
     *
     * @async
     * @param {CBS_Form} form
     * @returns {Promise<any>}
     */
    async modalForm(form) {
        return new Promise((res, rej) => {
            const submit = new CBS_Button({
                color: 'primary'
            });
            submit.content = 'Submit';
            const cancel = new CBS_Button({
                color: 'secondary'
            });
            cancel.content = 'Cancel';
            const modal = new CBS_Modal({
                buttons: [
                    submit,
                    cancel
                ]
            });
            modal.title = 'Fill out form';
            modal.subcomponents.body.append(form);
            modal.subcomponents.footer.append(submit);
            submit.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(form.value);
            });
            cancel.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(null);
            });
            form.on('submit', (e) => {
                e.preventDefault();
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(form.value);
            });
            modal.on('hidden.bs.modal', () => res(null));
            modal.on('destroyed', () => res(null));
            modal.show();
        });
    }
    /**
     * Replacement for prompt() that uses modals
     * Returns a promise that resolves to the value of the input if the user clicks Okay, null if the user clicks Cancel
     *
     * @async
     * @param {?*} [message]
     * @returns {Promise<string|null>}
     */
    async prompt(message) {
        return new Promise((res, rej) => {
            const submit = new CBS_Button({
                color: 'primary'
            });
            const cancel = new CBS_Button({
                color: 'secondary'
            });
            submit.content = 'Submit';
            cancel.content = 'Cancel';
            const modal = new CBS_Modal({
                buttons: [
                    submit
                ]
            });
            modal.title = 'Prompt';
            const input = new CBS_TextInput();
            modal.subcomponents.body.append(message);
            modal.subcomponents.body.append(input);
            input.on('keydown', (e) => {
                if (e.key === 'Enter') {
                    submit.el.click();
                }
            });
            submit.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(input.value);
            });
            cancel.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(null);
            });
            modal.subcomponents.footer.append(submit);
            modal.on('hidden.bs.modal', () => res(null));
            modal.on('destroyed', () => res(null));
            modal.show();
        });
    }
    modal(container) {
        const modal = new CBS_Modal();
        modal.subcomponents.body.append(container);
        modal.show();
        return modal;
    }
}
/**
 * The global CustomBootstrap instance
 *
 * @type {CustomBootstrap}
 */
const CBS = new CustomBootstrap();
(() => {
    // test for jQuery and popper
    try {
        $('hello-world');
    }
    catch {
        console.error('jQuery is not loaded!');
    }
    if (!$(document.createElement('button')).toast) {
        console.error('Popper is not loaded!');
    }
});
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
    static _templates = {
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
    static classFromTemplate(type) {
        const template = this.templates[type] || this.templates['default'];
        const constructor = template.constructor;
        const c = class extends constructor {
            constructor(...args) {
                super(...args);
            }
        };
        c.prototype.options = template.options;
        c.prototype.listeners = template.listeners;
        c.prototype.subcomponents = template.subcomponents;
        c.prototype.parameters = template.parameters;
        c.prototype._el = template._el.cloneNode(true);
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
    static fromTemplate(type, options) {
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
    static get templates() {
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
    static addTemplate(type, template) {
        if (template.constructor.name !== this.name) {
            throw new Error(`Template must be of type ${this.name}`);
        }
        if (this._templates[type])
            return false;
        this._templates[type] = template;
        return true;
    }
    // default properties
    /**
     * Parameters (used in writing/reading)
     *
     * @type {CBS_Parameters}
     */
    _parameters = {};
    /**
     * The element this class represents
     *
     * @type {HTMLElement}
     */
    _el = document.createElement('div');
    /**
     * All listeners for this element
     *
     * @type {CBS_Listener[]}
     */
    listeners = [];
    /**
     * All events and their respective callbacks (used in dispatching)
     *
     * @type {{ [key: string]: CBS_ListenerCallback }}
     */
    _events = {};
    /**
     * All components
     *
     * @type {CBS_NodeMap}
     */
    _components = [];
    /**
     * All options for this element
     *
     * @type {CBS_Options}
     */
    _options = {};
    /**
     * Description placeholder
     *
     * @readonly
     * @type {CBS_NodeMap}
     */
    get components() {
        return this._components;
    }
    // █▀▄ ▄▀▄ █▀▄ █▀▄ █ █▄ █ ▄▀     ▄▀▄ █▄ █ █▀▄    █▄ ▄█ ▄▀▄ █▀▄ ▄▀  █ █▄ █ 
    // █▀  █▀█ █▄▀ █▄▀ █ █ ▀█ ▀▄█    █▀█ █ ▀█ █▄▀    █ ▀ █ █▀█ █▀▄ ▀▄█ █ █ ▀█ 
    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    _padding = {};
    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    _margin = {};
    /**
     * Description placeholder
     *
     * @private
     * @param {string} paddingOrMargin
     * @param {string} key
     * @param {(number|undefined)} value
     */
    setPaddingOrMargin(paddingOrMargin, key, value) {
        const properties = [
            's',
            'e',
            't',
            'b',
            'x',
            'y'
        ];
        const set = (property, key, value) => {
            const abbr = paddingOrMargin[0];
            this.el.classList.remove(`${abbr}-${property.global}`); // removes glbal property
            if (key === 'global') {
                properties.forEach(p => {
                    this.el.classList.remove(`${abbr}${p}-${property[p]}`);
                    delete property[p];
                });
                property.global = value;
                this.el.classList.add(`${abbr}-${value}`);
            }
            else {
                delete property.global;
                this.el.classList.remove(`${abbr}${key}-${property[key]}`); // removes the current property
                property[key] = value;
                this.el.classList.add(`${abbr}${key}-${value}`);
            }
        };
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
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    set allPadding(padding) {
        this._padding = padding;
        if (padding.s)
            this.paddingS = padding.s;
        if (padding.e)
            this.paddingE = padding.e;
        if (padding.t)
            this.paddingT = padding.t;
        if (padding.b)
            this.paddingB = padding.b;
        if (padding.x)
            this.paddingX = padding.x;
        if (padding.y)
            this.paddingY = padding.y;
        if (padding.global)
            this.padding = padding.global;
    }
    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    get allPadding() {
        return this._padding;
    }
    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    set allMargin(margin) {
        this._margin = margin;
        if (margin.s)
            this.marginS = margin.s;
        if (margin.e)
            this.marginE = margin.e;
        if (margin.t)
            this.marginT = margin.t;
        if (margin.b)
            this.marginB = margin.b;
        if (margin.x)
            this.marginX = margin.x;
        if (margin.y)
            this.marginY = margin.y;
        if (margin.global)
            this.margin = margin.global;
    }
    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    get allMargin() {
        return this._margin;
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set padding(value) {
        this.setPaddingOrMargin('padding', 'global', value);
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingX(value) {
        this.setPaddingOrMargin('padding', 'x', value);
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingY(value) {
        this.setPaddingOrMargin('padding', 'y', value);
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingS(value) {
        this.setPaddingOrMargin('padding', 's', value);
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingE(value) {
        this.setPaddingOrMargin('padding', 'e', value);
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingT(value) {
        this.setPaddingOrMargin('padding', 't', value);
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingB(value) {
        this.setPaddingOrMargin('padding', 'b', value);
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set margin(value) {
        this.setPaddingOrMargin('margin', 'global', value);
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginX(value) {
        this.setPaddingOrMargin('margin', 'x', value);
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginY(value) {
        this.setPaddingOrMargin('margin', 'y', value);
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginS(value) {
        this.setPaddingOrMargin('margin', 's', value);
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginE(value) {
        this.setPaddingOrMargin('margin', 'e', value);
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginT(value) {
        this.setPaddingOrMargin('margin', 't', value);
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginB(value) {
        this.setPaddingOrMargin('margin', 'b', value);
    }
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get padding() {
        return this._padding.global;
    }
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingX() {
        return this._padding.x;
    }
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingY() {
        return this._padding.y;
    }
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingS() {
        return this._padding.s;
    }
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingE() {
        return this._padding.e;
    }
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingT() {
        return this._padding.t;
    }
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingB() {
        return this._padding.b;
    }
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get margin() {
        return this._margin.global;
    }
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginX() {
        return this._margin.x;
    }
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginY() {
        return this._margin.y;
    }
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginS() {
        return this._margin.s;
    }
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginE() {
        return this._margin.e;
    }
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginT() {
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
    static _customEvents = [
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
    static get customEvents() {
        return this._customEvents;
    }
    /**
     * Sets all custom events for this element
     *
     * @static
     * @type {{}}
     */
    static set customEvents(events) {
        this._customEvents = events;
    }
    /**
     * Adds a single custom event to the prototype
     *
     * @static
     * @param {string} event
     */
    static addCustomEvent(event) {
        this._customEvents.push(event);
    }
    /**
     * Removes a single custom event from the prototype
     *
     * @static
     * @param {string} event
     */
    static removeCustomEvent(event) {
        this._customEvents = this.customEvents.filter(e => e !== event);
    }
    /**
     * Adds multiple custom events to the prototype
     *
     * @static
     * @param {...string[]} events
     */
    static addCustomEvents(...events) {
        this._customEvents.push(...events);
    }
    /**
     * Removes multiple custom events from the prototype
     *
     * @static
     * @param {...string[]} events
     */
    static removeCustomEvents(...events) {
        this._customEvents = this.customEvents.filter(e => !events.includes(e));
    }
    /**
     * Creates an instance of CBS_Element
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        // console.log('CBS_Element Constructor', JSON.stringify(options));
        this.options = options || {};
    }
    /**
     * Gets the options for this element
     *
     * @type {CBS_Options}
     */
    get options() {
        return this._options;
    }
    /**
     * Sets the options for this element and renders
     *
     * @type {CBS_Options}
     */
    set options(options) {
        if (!this._el)
            return;
        const { classes, attributes, style, id } = options;
        this._options = options;
        if (classes)
            this.classes = classes;
        if (attributes)
            this.attributes = attributes;
        if (style)
            this.style = style;
        if (id)
            this.id = id;
    }
    /**
     * Gets the element this class represents
     *
     * @type {HTMLElement}
     */
    get el() {
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
    set el(el) {
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
    _id = '';
    get id() {
        return this._id;
    }
    set id(id) {
        if (!this._el)
            return;
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
    append(...elements) {
        elements.forEach(el => {
            if (el instanceof CBS_Element) {
                this._el.appendChild(el._el);
                el.render();
                el.parent = this;
            }
            else if (typeof el === 'string') {
                this._el.innerHTML += el;
            }
            else {
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
    removeElement(...elements) {
        elements.forEach(el => {
            if (el instanceof CBS_Element) {
                this._el.removeChild(el._el);
                el.render();
                el.parent = null;
            }
            else if (typeof el === 'string') {
                this._el.innerHTML = this._el.innerHTML.replace(el, '');
            }
            else {
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
    prepend(...elements) {
        elements.forEach(el => {
            if (el instanceof CBS_Element) {
                this._el.prepend(el._el);
                el.render();
                el.parent = this;
            }
            else if (typeof el === 'string') {
                this._el.innerHTML = el + this._el.innerHTML;
            }
            else {
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
    replace(nodeToReplace, ...elementsToAdd) {
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
    insertBefore(nodeToInsertBefore, ...elementsToAdd) {
        if (this._components.includes(nodeToInsertBefore)) {
            const index = this._components.indexOf(nodeToInsertBefore);
            this._components.splice(index, 0, ...elementsToAdd);
            let node;
            // adds elements to components
            if (nodeToInsertBefore instanceof CBS_Element) {
                node = nodeToInsertBefore._el;
            }
            else if (typeof nodeToInsertBefore === 'string') {
                [node] = CBS.createElementFromText(nodeToInsertBefore);
            }
            else {
                node = nodeToInsertBefore;
            }
            // adds elements to the DOM
            elementsToAdd.forEach((el, i) => {
                if (el instanceof CBS_Element) {
                    this._el.insertBefore(el._el, (node instanceof CBS_Element) ? node._el : node);
                    el.render();
                    el.parent = this;
                }
                else if (typeof el === 'string') {
                    const div = document.createElement('div');
                    div.innerHTML = el;
                    this._el.insertBefore(div, (node instanceof CBS_Element) ? node._el : node);
                }
                else {
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
    insertAfter(nodeToInsertAfter, ...elementsToAdd) {
        if (this._components.includes(nodeToInsertAfter)) {
            const index = this._components.indexOf(nodeToInsertAfter);
            const nextNode = this._components[index + 1];
            if (nextNode) {
                this.insertBefore(nextNode, ...elementsToAdd);
            }
            else {
                this.append(...elementsToAdd);
            }
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
    _parent = null;
    /**
     * Gets the parent of this element
     *
     * @readonly
     * @type {(HTMLElement|null)}
     */
    get parent() {
        return this._parent;
    }
    set parent(parent) {
        this._parent = parent;
    }
    // █▀▄ ▄▀▄ █▀▄ ▄▀▄ █▄ ▄█ ██▀ ▀█▀ ██▀ █▀▄ ▄▀▀ 
    // █▀  █▀█ █▀▄ █▀█ █ ▀ █ █▄▄  █  █▄▄ █▀▄ ▄█▀ 
    /**
     * Creates all <span> and <div> to replace {{}} in the HTML
     */
    render() {
        const isShallow = (el) => !el.children.length;
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
    write(key, value, trigger = true) {
        if (this._el) {
            this._el.querySelectorAll(`*[data-cbs-${this.constructor.name.toLowerCase()}="${key}"]`).forEach(el => {
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    el.innerHTML = value.toString();
                }
                else if (typeof value === 'undefined' || value === null) {
                    el.innerHTML = '';
                }
                else if (value instanceof HTMLElement) {
                    el.innerHTML = '';
                    el.appendChild(value);
                }
                else if (value instanceof CBS_Element) {
                    while (el.firstChild) {
                        el.removeChild(el.firstChild);
                    }
                    el.appendChild(value.el);
                }
                else {
                    console.error('Invalid value type', value);
                }
            });
            this.parameters[key] = value;
            this.trigger(`parameter.write:${key}`);
            if (trigger)
                this.trigger('parameters.write');
            for (const c of this.components) {
                if (c instanceof CBS_Element)
                    c.write(key, value, trigger);
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
    read(param, asHTML = false) {
        if (this._el) {
            this.trigger('parameter.read');
            const arr = Array.from(this._el.querySelectorAll(`[data-cbs-${this.constructor.name}="${param}"]`));
            if (asHTML)
                return arr.map(el => el.children[0] || el);
            return arr.map(el => el.innerHTML);
        }
        return [];
    }
    /**
     * Gets all parameters
     *
     * @type {CBS_Parameters}
     */
    get parameters() {
        return this._parameters;
    }
    /**
     * Sets all parameters and writs them to the element
     *
     * @type {CBS_Parameters}
     */
    set parameters(params) {
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
    on(event, callback, isAsync = true) {
        if (!this._el)
            throw new Error('No element to add listener to');
        // if (!event && !callback) {
        //     reset all .off() listeners
        // }
        // if (options && typeof options !== 'object') throw new Error('Options must be an object');
        const errCallback = async (e) => {
            return new Promise(async (res, rej) => {
                let success = true;
                const listeners = this.listeners.filter(l => l.event === event);
                const promises = listeners.filter(l => l.isAsync).map(async (l) => l.callback(e)?.catch((err) => {
                    success = false;
                    console.error(err);
                }));
                for (const listener of listeners.filter(l => !l.isAsync)) {
                    try {
                        await listener.callback(e);
                    }
                    catch (err) {
                        success = false;
                        console.error(err);
                    }
                }
                await Promise.all(promises);
                res(success);
            });
        };
        this.listeners.push(new CBS_Listener(event, callback, isAsync));
        if (!this.hasListener(event)) {
            this._events[event] = errCallback;
            this._el.addEventListener(event, errCallback);
        }
    }
    /**
     * If the element has a listener for the event
     *
     * @param {string} event
     * @returns {boolean}
     */
    hasListener(event) {
        return !!this._events[event];
    }
    /**
     * Removes a listener from the element
     *
     * @param {?string} [event]
     * @param {?CBS_ListenerCallback} [callback]
     */
    off(event, callback) {
        if (!this._el)
            throw new Error('No element to remove event listener from');
        if (!event) {
            this.listeners = [];
            Object.entries(this._events).forEach(([event, cb]) => {
                this._el.removeEventListener(event, cb);
            });
            this._events = {};
            return;
        }
        if (typeof event !== 'string')
            throw new Error('event must be a string, received ' + typeof event);
        if (!callback) {
            this.listeners = this.listeners.filter(listener => listener.event !== event);
            return;
        }
        if (typeof callback !== 'function')
            throw new Error('callback must be a function, received ' + typeof callback);
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
    async trigger(event, options) {
        return new Promise((res, rej) => {
            if (!this._el)
                throw new Error('No element to trigger event on');
            if (typeof event !== 'string')
                throw new Error('event must be a string, received ' + typeof event);
            if (this.constructor.prototype._customEvents?.includes(event)) {
                const e = new CustomEvent(event, {
                    ...(options || {}),
                    detail: {
                        name: this.constructor.name + ':' + event,
                        element: this.el
                    }
                });
                return this.el.dispatchEvent(e);
            }
            else {
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
     * Description placeholder
     */
    destroy() {
        this.trigger('el.destroy');
        this.parent?.removeElement(this);
        this.off();
        this._components.forEach(c => {
            if (c instanceof CBS_Element)
                c.destroy();
        });
        this._el.remove();
    }
    /**
     * Clones this
     * @param {Boolean} listeners Whether or not to clone all listeners (default: true)
     * @returns {CBS_Element} A clone of this
     */
    clone(listeners = true) {
        // this will probably need to be changed for every extension of this class
        const constructor = this.constructor;
        const clone = new constructor(this.options);
        clone._el = this._el.cloneNode(true);
        // clones all listeners too
        if (listeners)
            this.listeners.forEach(listener => {
                clone.on(listener.event, listener.callback);
            });
        this.trigger('el.clone');
        return clone;
    }
    // ▄▀▀ █   ▄▀▄ ▄▀▀ ▄▀▀ ██▀ ▄▀▀ 
    // ▀▄▄ █▄▄ █▀█ ▄█▀ ▄█▀ █▄▄ ▄█▀ 
    /**
     * Description placeholder
     *
     * @param {...string[]} classes
     */
    addClass(...classes) {
        if (!this._options)
            this.options = {};
        if (!this._options.classes)
            this._options.classes = [];
        this._options.classes = [...this._options.classes, ...classes];
        this.el.classList.add(...classes);
    }
    /**
     * Description placeholder
     *
     * @param {...string[]} classes
     */
    removeClass(...classes) {
        if (!this._options)
            this.options = {};
        if (!this._options.classes)
            this._options.classes = [];
        this._options.classes = this._options.classes.filter(c => !classes.includes(c));
        this.el.classList.remove(...classes);
    }
    /**
     * Description placeholder
     *
     * @param {...string[]} classes
     */
    toggleClass(...classes) {
        if (!this._options.classes)
            this._options.classes = [];
        this._options.classes = this._options.classes.filter(c => !classes.includes(c));
        classes.forEach(c => {
            this.el.classList.toggle(c);
        });
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {{}}
     */
    get classes() {
        return Array.from(this.el.classList);
    }
    set classes(classes) {
        this.clearClasses();
        this.addClass(...classes);
    }
    clearClasses() {
        this.el.classList.remove(...this.classes);
    }
    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {*}
     */
    hasClass(...name) {
        return name.every(c => this.el.classList.contains(c));
    }
    // ▄▀▀ ▀█▀ ▀▄▀ █   ██▀ 
    // ▄█▀  █   █  █▄▄ █▄▄ 
    get style() {
        return this.el.style;
    }
    set style(style) {
        Object.assign(this.el.style, style);
    }
    // ▄▀▄ ▀█▀ ▀█▀ █▀▄ █ ██▄ █ █ ▀█▀ ██▀ ▄▀▀ 
    // █▀█  █   █  █▀▄ █ █▄█ ▀▄█  █  █▄▄ ▄█▀ 
    _attributes = {};
    /**
     * Description placeholder
     *
     * @param {string} name
     * @param {string} value
     */
    setAttribute(name, value) {
        this._el.setAttribute(name, value);
        this._attributes[name] = value;
    }
    /**
     * Description placeholder
     *
     * @param {string} name
     */
    removeAttribute(name) {
        this._el.removeAttribute(name);
        delete this._attributes[name];
    }
    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {string}
     */
    getAttribute(name) {
        return this._attributes[name];
    }
    clearAttributes() {
        Object.keys(this._attributes).forEach(this.removeAttribute.bind(this));
    }
    get attributes() {
        return this._attributes;
    }
    set attributes(attributes) {
        this.clearAttributes();
        this._attributes = attributes;
        Object.keys(attributes).forEach(key => {
            this.setAttribute(key, attributes[key]);
        });
    }
    // ██▀ █ █ ██▀ █▄ █ ▀█▀ ▄▀▀ 
    // █▄▄ ▀▄▀ █▄▄ █ ▀█  █  ▄█▀ 
    /**
     * Description placeholder
     *
     * @param {(MouseEvent|TouchEvent)} e
     * @returns {{ x: number; y: number; }}
     */
    getXY(e) {
        if (e.touches) {
            return {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
        else {
            return {
                x: e.clientX,
                y: e.clientY
            };
        }
    }
    /**
     * Description placeholder
     *
     * @param {TouchEvent} e
     * @returns {*}
     */
    getXYList(e) {
        return Array.from(e.touches).map(t => {
            return {
                x: t.clientX,
                y: t.clientY
            };
        });
    }
    // ▄▀▀ ▄▀▄ █   ▄▀▄ █▀▄ 
    // ▀▄▄ ▀▄▀ █▄▄ ▀▄▀ █▀▄ 
    /**
     * Description placeholder
     *
     * @type {(CBS_Color|undefined)}
     */
    _background;
    /**
     * Description placeholder
     *
     * @type {*}
     */
    set background(color) {
        if (this.background)
            this.removeClass(`bg-${this.background}`);
        this._background = color;
        if (color)
            this.addClass(`bg-${color}`);
    }
    /**
     * Description placeholder
     *
     * @type {(CBS_Color|undefined)}
     */
    get background() {
        return this._background;
    }
    get html() {
        return this.el.innerHTML;
    }
    set html(text) {
        this.el.innerHTML = text;
    }
    get content() {
        return this.components;
    }
    set content(content) {
        this.clearElements();
        if (Array.isArray(content))
            this.append(...content);
        else
            this.append(content);
    }
}
;
/**
 * Layer between larger components and their respective elements
 * I don't know if this is necessary, but it's here for now
 * This just makes it easier to differentiate if a class is a component or an element (has mulitple elements or is just one)
 *
 * @class CBS_Component
 * @typedef {CBS_Component}
 * @extends {CBS_Element}
 */
class CBS_Component extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents = {};
    /**
     * Creates an instance of CBS_Component.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super(options);
        // Object.values(this.subcomponents).forEach((value) => {
        //     this.append(value);
        // });
    }
}
class CBS_Document extends CBS_Component {
    constructor(options) {
        super(options);
    }
}
CBS.addElement('dom', CBS_Document);
var CBS_Breakpoint;
(function (CBS_Breakpoint) {
    CBS_Breakpoint[CBS_Breakpoint["xs"] = 0] = "xs";
    CBS_Breakpoint[CBS_Breakpoint["sm"] = 576] = "sm";
    CBS_Breakpoint[CBS_Breakpoint["md"] = 768] = "md";
    CBS_Breakpoint[CBS_Breakpoint["lg"] = 992] = "lg";
    CBS_Breakpoint[CBS_Breakpoint["xl"] = 1200] = "xl";
    CBS_Breakpoint[CBS_Breakpoint["xxl"] = 1400] = "xxl";
})(CBS_Breakpoint || (CBS_Breakpoint = {}));
var CBS_Color;
(function (CBS_Color) {
    CBS_Color["primary"] = "primary";
    CBS_Color["secondary"] = "secondary";
    CBS_Color["success"] = "success";
    CBS_Color["danger"] = "danger";
    CBS_Color["warning"] = "warning";
    CBS_Color["info"] = "info";
    CBS_Color["light"] = "light";
    CBS_Color["dark"] = "dark";
    CBS_Color["white"] = "white";
    CBS_Color["transparent"] = "transparent";
})(CBS_Color || (CBS_Color = {}));
var CBS_Size;
(function (CBS_Size) {
    CBS_Size["xs"] = "xs";
    CBS_Size["sm"] = "sm";
    CBS_Size["md"] = "md";
    CBS_Size["lg"] = "lg";
    CBS_Size["xl"] = "xl";
    CBS_Size["xxl"] = "xxl";
})(CBS_Size || (CBS_Size = {}));
var CBS_Weight;
(function (CBS_Weight) {
    CBS_Weight["normal"] = "normal";
    CBS_Weight["bold"] = "bold";
    CBS_Weight["bolder"] = "bolder";
    CBS_Weight["lighter"] = "lighter";
})(CBS_Weight || (CBS_Weight = {}));
var CBS_Align;
(function (CBS_Align) {
    CBS_Align["left"] = "left";
    CBS_Align["center"] = "center";
    CBS_Align["right"] = "right";
    CBS_Align["justify"] = "justify";
})(CBS_Align || (CBS_Align = {}));
var CBS_Icons;
(function (CBS_Icons) {
    CBS_Icons["success"] = "\n        <svg xmlns=\"http://www.w3.org/2000/svg\">\n            <symbol id=\"check-circle-fill\" fill=\"currentColor\" viewBox=\"0 0 16 16\">\n                <path d=\"M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z\"/>\n            </symbol>\n        </svg>\n    ";
    CBS_Icons["info"] = "\n        <svg xmlns=\"http://www.w3.org/2000/svg\">\n            <symbol id=\"info-fill\" fill=\"currentColor\" viewBox=\"0 0 16 16\">\n                <path d=\"M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z\"/>\n            </symbol>\n        </svg>\n    ";
    CBS_Icons["warn"] = "\n        <svg xmlns=\"http://www.w3.org/2000/svg\">\n            <symbol id=\"exclamation-triangle-fill\" fill=\"currentColor\" viewBox=\"0 0 16 16\">\n                <path d=\"M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z\"/>\n            </symbol>\n        </svg>\n    ";
})(CBS_Icons || (CBS_Icons = {}));
/**
 * Description placeholder
 *
 * @class CBS_Col
 * @typedef {CBS_Col}
 * @extends {CBS_Element}
 */
class CBS_Col extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {{
            [key: string]: number;
        }}
     */
    breakpoints = {};
    /**
     * Creates an instance of CBS_Col.
     *
     * @constructor
     * @param {?CBS_ColOptions} [options]
     */
    constructor(options) {
        super(options);
        this.options = {
            classes: ['col'],
            ...options
        };
    }
    /**
     * Description placeholder
     *
     * @param {string} breakpoint
     * @param {number} size
     */
    addBreakpoint(breakpoint, size) {
        this.addClass(`col-${breakpoint}-${size}`);
        this.breakpoints[breakpoint] = size;
    }
    /**
     * Description placeholder
     *
     * @param {string} breakpoint
     */
    removeBreakpoint(breakpoint) {
        this.removeClass(`col-${breakpoint}-${this.breakpoints[breakpoint]}`);
        delete this.breakpoints[breakpoint];
    }
    set options(options) {
        super.options = options;
        if (options.breakpoints) {
            if (!this.breakpoints)
                this.breakpoints = {};
            for (const breakpoint in options.breakpoints) {
                this.addBreakpoint(breakpoint, options.breakpoints[breakpoint]);
            }
        }
    }
    get options() {
        return this._options;
    }
}
CBS.addElement('col', CBS_Col);
/**
 * Description placeholder
 *
 * @class CBS_Container
 * @typedef {CBS_Container}
 * @extends {CBS_Element}
 */
class CBS_Container extends CBS_Element {
    /**
     * Creates an instance of CBS_Container.
     *
     * @constructor
     * @param {?CBS_ContainerOptions} [options]
     */
    constructor(options) {
        super(options);
        if (options?.fluid) {
            this.addClass('container-fluid');
        }
        else {
            this.addClass('container');
        }
    }
    /**
     * Description placeholder
     *
     * @type {CBS_ContainerOptions}
     */
    set options(options) {
        super.options = options;
        if (options?.fluid) {
            this.addClass('container-fluid');
        }
        else {
            this.addClass('container');
        }
    }
    get options() {
        return this._options;
    }
    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    set fluid(fluid) {
        this.options = {
            ...this.options,
            fluid
        };
    }
    /**
     * Description placeholder
     *
     * @returns {*}
     */
    addRow(options) {
        const row = new CBS_Row(options);
        this.append(row);
        return row;
    }
}
CBS.addElement('container', CBS_Container);
/**
 * Description placeholder
 *
 * @class CBS_Row
 * @typedef {CBS_Row}
 * @extends {CBS_Element}
 */
class CBS_Row extends CBS_Element {
    /**
     * Creates an instance of CBS_Row.
     *
     * @constructor
     * @param {?CBS_RowOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('div');
        this.addClass('row');
    }
    /**
     * Description placeholder
     *
     * @param {?CBS_BreakpointMap} [breakpoints]
     * @returns {CBS_Col}
     */
    addCol(breakpoints) {
        const col = new CBS_Col({
            breakpoints: breakpoints
        });
        this.append(col);
        return col;
    }
    /**
     * Description placeholder
     *
     * @param {CBS_Col} col
     */
    removeCol(col) {
        this.removeElement(col);
    }
}
/**
 * Description placeholder
 *
 * @class CBS_Text
 * @typedef {CBS_Component}
 * @extends {CBS_Element}
 */
class CBS_Text extends CBS_Element {
    __color;
    __size;
    __weight;
    __align;
    /**
     * Creates an instance of CBS_Text.
     *
     * @constructor
     * @param {?CBS_TextOptions} [options]
     */
    constructor(options) {
        super(options);
    }
    set text(text) {
        this.el.innerText = text;
    }
    get text() {
        return this.el.innerText;
    }
    set html(html) {
        this.el.innerHTML = html;
    }
    get html() {
        return this.el.innerHTML;
    }
    set color(color) {
        if (this.color)
            this.removeClass(`text-${this.color}`);
        this.__color = color;
        if (color)
            this.addClass(`text-${color}`);
    }
    get color() {
        return this.__color;
    }
    set size(size) {
        if (this.size)
            this.removeClass(`text-${this.size}`);
        this.__size = size;
        if (size)
            this.addClass(`text-${size}`);
    }
    get size() {
        return this.__size;
    }
    set weight(weight) {
        if (this.weight)
            this.removeClass(`font-${this.weight}`);
        this.__weight = weight;
        if (weight)
            this.addClass(`font-${weight}`);
    }
    get weight() {
        return this.__weight;
    }
    set align(align) {
        if (this.align)
            this.removeClass(`text-${this.align}`);
        this.__align = align;
        if (align)
            this.addClass(`text-${align}`);
    }
    get align() {
        return this.__align;
    }
}
/**
 * Description placeholder
 *
 * @class CBS_Anchor
 * @typedef {CBS_Anchor}
 * @extends {CBS_Component}
 */
class CBS_Anchor extends CBS_Component {
    /**
     * Creates an instance of CBS_Anchor.
     *
     * @constructor
     * @param {?CBS_AnchorOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('a');
    }
}
CBS.addElement('a', CBS_Anchor);
/**
 * Description placeholder
 *
 * @class CBS_Heading
 * @typedef {CBS_Heading}
 * @extends {CBS_Component}
 */
class CBS_Heading extends CBS_Text {
    /**
     * Creates an instance of CBS_Heading.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options) {
        super(options);
    }
}
/**
 * Description placeholder
 *
 * @class CBS_H1
 * @typedef {CBS_H1}
 * @extends {CBS_Heading}
 */
class CBS_H1 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H1.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('h1');
    }
}
/**
 * Description placeholder
 *
 * @class CBS_H2
 * @typedef {CBS_H2}
 * @extends {CBS_Heading}
 */
class CBS_H2 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H2.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('h2');
    }
}
/**
 * Description placeholder
 *
 * @class CBS_H3
 * @typedef {CBS_H3}
 * @extends {CBS_Heading}
 */
class CBS_H3 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H3.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('h3');
    }
}
/**
 * Description placeholder
 *
 * @class CBS_H4
 * @typedef {CBS_H4}
 * @extends {CBS_Heading}
 */
class CBS_H4 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H4.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('h4');
    }
}
/**
 * Description placeholder
 *
 * @class CBS_H5
 * @typedef {CBS_H5}
 * @extends {CBS_Heading}
 */
class CBS_H5 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H5.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('h5');
    }
}
/**
 * Description placeholder
 *
 * @class CBS_H6
 * @typedef {CBS_H6}
 * @extends {CBS_Heading}
 */
class CBS_H6 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H6.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('h6');
    }
}
CBS.addElement('h1', CBS_H1);
CBS.addElement('h2', CBS_H2);
CBS.addElement('h3', CBS_H3);
CBS.addElement('h4', CBS_H4);
CBS.addElement('h5', CBS_H5);
CBS.addElement('h6', CBS_H6);
/**
 * Description placeholder
 *
 * @class CBS_Paragraph
 * @typedef {CBS_Component}
 * @extends {CBS_Component}
 */
class CBS_Paragraph extends CBS_Text {
    /**
     * Creates an instance of CBS_Paragraph.
     *
     * @constructor
     * @param {?CBS_ParagraphOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('p');
    }
}
CBS.addElement('p', CBS_Paragraph);
class CBS_Span extends CBS_Element {
    constructor(options) {
        super(options);
        this.el = document.createElement('span');
    }
}
CBS.addElement('span', CBS_Span);
/**
 * Description placeholder
 *
 * @class CBS_Button
 * @typedef {CBS_Button}
 * @extends {CBS_Component}
 */
class CBS_Button extends CBS_Element {
    /**
     * Creates an instance of CBS_Button.
     *
     * @constructor
     * @param {?CBS_ButtonOptions} [options]
     */
    constructor(options) {
        // console.log('CBS_Button constructor', JSON.stringify(options));
        super(options);
        this.el = document.createElement('button');
        this.addClass('btn');
    }
    /**
     * Description placeholder
     *
     * @type {CBS_ButtonOptions}
     */
    set options(options) {
        super.options = options;
        if (options.color) {
            if (options.outlined) {
                this.el.classList.add(`btn-outline-${options.color}`);
            }
            else {
                this.el.classList.add(`btn-${options.color}`);
            }
        }
        if (options.size) {
            this.addClass(`btn-${options.size}`);
            // this.el.classList.add(`btn-${options.size}`);
        }
        if (options.rounded) {
            this.addClass(`btn-rounded`);
            // this.el.classList.add(`btn-rounded`);
        }
        if (options.shadow) {
            this.addClass(`btn-shadow`);
            // this.el.classList.add(`btn-shadow`);
        }
    }
    get options() {
        return this._options;
    }
    /**
     * Description placeholder
     */
    disable() {
        this.el.setAttribute('disabled', 'disabled');
    }
    /**
     * Description placeholder
     */
    enable() {
        this.el.removeAttribute('disabled');
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get enabled() {
        return !this.disabled;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get disabled() {
        return this.el.hasAttribute('disabled');
    }
}
CBS.addElement('button', CBS_Button);
(() => {
    const modalClose = new CBS_Button({
        color: 'secondary',
        size: CBS_Size.sm,
        classes: ['btn-close'],
        attributes: {
            'type': 'button',
            'data-bs-dismiss': 'modal',
            'aria-label': 'Close'
        }
    });
    // modalClose.removeClass('btn');
    CBS_Button.addTemplate('modal-close', modalClose);
})();
/**
 * Description placeholder
 *
 * @class CBS_CardHeader
 * @typedef {CBS_CardHeader}
 * @extends {CBS_Element}
 */
class CBS_CardHeader extends CBS_Element {
    /**
     * Creates an instance of CBS_CardHeader.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super(options);
        this._el = document.createElement('div');
        this._el.classList.add('card-header');
    }
}
/**
 * Description placeholder
 *
 * @class CBS_CardBody
 * @typedef {CBS_CardBody}
 * @extends {CBS_Element}
 */
class CBS_CardBody extends CBS_Element {
    /**
     * Creates an instance of CBS_CardBody.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super(options);
        this._el = document.createElement('div');
        this._el.classList.add('card-body');
    }
}
/**
 * Description placeholder
 *
 * @class CBS_CardFooter
 * @typedef {CBS_CardFooter}
 * @extends {CBS_Element}
 */
class CBS_CardFooter extends CBS_Element {
    /**
     * Creates an instance of CBS_CardFooter.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super(options);
        this._el = document.createElement('div');
        this._el.classList.add('card-footer');
    }
}
/**
 * Description placeholder
 *
 * @class CBS_Card
 * @typedef {CBS_Card}
 * @extends {CBS_Component}
 */
class CBS_Card extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents = {
        header: new CBS_CardHeader(),
        body: new CBS_CardBody(),
        footer: new CBS_CardFooter()
    };
    /**
     * Creates an instance of CBS_Card.
     *
     * @constructor
     * @param {?CBS_CardOptions} [options]
     */
    constructor(options) {
        super(options);
        this._el = document.createElement('div');
        this._el.classList.add('card');
        this.append(this.subcomponents.header, this.subcomponents.body, this.subcomponents.footer);
    }
}
CBS.addElement('card', CBS_Card);
/**
 * Description placeholder
 *
 * @class CBS_ModalTitle
 * @typedef {CBS_ModalHeader}
 * @extends {CBS_Element}
 */
class CBS_ModalHeader extends CBS_Component {
    subcomponents = {
        title: new CBS_H5()
    };
    /**
     * Creates an instance of CBS_ModalTitle.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('modal-header');
        this.prepend(this.subcomponents.title);
    }
    get text() {
        return this.subcomponents.title.text;
    }
    set text(text) {
        this.subcomponents.title.text = text || '';
    }
}
/**
 * Description placeholder
 *
 * @class CBS_ModalBody
 * @typedef {CBS_ModalBody}
 * @extends {CBS_Element}
 */
class CBS_ModalBody extends CBS_Element {
    /**
     * Creates an instance of CBS_ModalBody.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('modal-body');
    }
}
/**
 * Description placeholder
 *
 * @class CBS_ModalFooter
 * @typedef {CBS_ModalFooter}
 * @extends {CBS_Element}
 */
class CBS_ModalFooter extends CBS_Element {
    /**
     * Creates an instance of CBS_ModalFooter.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('modal-footer');
    }
}
/**
 * Description placeholder
 *
 * @class CBS_ModalDialog
 * @typedef {CBS_ModalDialog}
 * @extends {CBS_Component}
 */
class CBS_ModalDialog extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents;
    /**
     * Creates an instance of CBS_ModalDialog.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('div');
        this.addClass('modal-dialog');
        this.setAttribute('role', 'document');
        const content = new CBS_ModalContent();
        this.subcomponents = {
            content: content,
            title: content.subcomponents.header,
            body: content.subcomponents.body,
            footer: content.subcomponents.footer,
            hide: CBS_Button.fromTemplate('modal-close')
        };
        content.append(this.subcomponents.title, this.subcomponents.body, this.subcomponents.footer);
        this.append(content);
        this.subcomponents.title.append(this.subcomponents.hide);
    }
}
class CBS_ModalContent extends CBS_Component {
    subcomponents = {
        header: new CBS_ModalHeader(),
        body: new CBS_ModalBody(),
        footer: new CBS_ModalFooter()
    };
    constructor(options) {
        super(options);
        this.addClass('modal-content');
    }
}
/**
 * Description placeholder
 *
 * @class CBS_Modal
 * @typedef {CBS_Modal}
 * @extends {CBS_Component}
 */
class CBS_Modal extends CBS_Component {
    /**
     * Creates an instance of CBS_Modal.
     *
     * @constructor
     * @param {?CBS_ModalOptions} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('modal', 'fade');
        this.setAttribute('tabindex', '-1');
        this.setAttribute('role', 'dialog');
        this.setAttribute('aria-hidden', 'true');
        this.setAttribute('aria-labelledby', 'modal-title');
        const dialog = new CBS_ModalDialog();
        dialog.subcomponents.hide.on('click', () => {
            this.hide();
        });
        this.subcomponents = {
            dialog,
            body: dialog.subcomponents.body,
            title: dialog.subcomponents.title,
            footer: dialog.subcomponents.footer
        };
        this.append(this.subcomponents.dialog);
    }
    get title() {
        return this.subcomponents.title.subcomponents.title.text;
    }
    set title(title) {
        this.subcomponents.title.subcomponents.title.text = title;
    }
    get body() {
        return this.subcomponents.body;
    }
    set body(body) {
        this.subcomponents.body = body;
    }
    get footer() {
        return this.subcomponents.footer;
    }
    set footer(footer) {
        this.subcomponents.footer = footer;
    }
    /**
     * Description placeholder
     *
     * @type {CBS_ModalOptions}
     */
    set options(options) {
        super.options = options;
        if (options.buttons && this.subcomponents?.dialog) {
            this.subcomponents.dialog.subcomponents.footer.append(...options.buttons);
        }
    }
    get options() {
        return this._options;
    }
    /**
     * Description placeholder
     */
    show() {
        $(this._el).modal('show');
    }
    /**
     * Description placeholder
     */
    hide() {
        $(this._el).modal('hide');
    }
}
CBS.addElement('modal', CBS_Modal);
/**
 * Description placeholder
 *
 * @class CBS_ProgressBar
 * @typedef {CBS_ProgressBar}
 * @extends {CBS_Component}
 */
class CBS_ProgressBar extends CBS_Component {
    /**
     * Creates an instance of CBS_ProgressBar.
     *
     * @constructor
     * @param {?CBS_ProgressBarOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('div');
        this.addClass('progress-bar', 'rounded', 'shadow');
        this.setAttribute('aria-valuenow', '0');
        this.setAttribute('aria-valuemin', '0');
        this.setAttribute('aria-valuemax', '100');
        this.style = {
            width: '0%',
            height: '24px'
        };
    }
}
/**
 * Description placeholder
 *
 * @class CBS_Progress
 * @typedef {CBS_Progress}
 * @extends {CBS_Component}
 */
class CBS_Progress extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents = {
        text: new CBS_Component({
            classes: [
                'm-2'
            ]
        }),
        bar: new CBS_ProgressBar()
    };
    /**
     * Creates an instance of CBS_Progress.
     *
     * @constructor
     * @param {?CBS_ProgressBarOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('div');
        this.options = {
            ...this.options,
            classes: [
                ...(this.options.classes || []),
                'd-flex',
                'justify-content-between',
                'align-items-center',
                'mb-3',
                'w-100',
                'p-2',
                'position-fixed',
                'bg-secondary',
                'rounded',
                'text-light',
                // To be used with animate.css
                'animate__animated',
                'animate__fadeInDown'
            ],
            style: {
                ...this.options.style,
                opacity: '0.9'
            }
        };
        this.append(this.subcomponents.text, this.subcomponents.bar);
        this.subcomponents.text.el.innerHTML = 'Loading... {{progress}}%';
        this.parameters = {
            progress: 0
        };
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set progress(progress) {
        this.parameters = {
            ...this.parameters,
            progress
        };
        this.subcomponents.bar.options = {
            ...this.subcomponents.bar.options,
            style: {
                ...this.subcomponents.bar.options.style,
                width: `${progress}%`
            },
            attributes: {
                ...this.subcomponents.bar.options.attributes,
                'aria-valuenow': `${progress}`
            }
        };
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get progress() {
        return this.parameters.progress;
    }
    /**
     * Description placeholder
     */
    destroy() {
        setTimeout(super.destroy, 1000); // in case the animation doesn't work
        this.el.classList.add('animate__fadeOutUp');
        this.el.classList.remove('animate__fadeInDown');
        this.on('animationend', () => {
            super.destroy();
        });
    }
}
CBS.addElement('progress-bar', CBS_Progress);
class CBS_TableBody extends CBS_Element {
    constructor(options) {
        super(options);
        this.el = document.createElement('tbody');
    }
    addRow(options) {
        const row = new CBS_TableRow(options);
        this.append(row);
        return row;
    }
}
class CBS_TableData extends CBS_Element {
    constructor(options) {
        super(options);
        this.el = document.createElement('td');
    }
}
class CBS_TableHeader extends CBS_Element {
    constructor(options) {
        super(options);
        this.el = document.createElement('th');
    }
}
class CBS_TableHead extends CBS_Element {
    constructor(options) {
        super(options);
        this.el = document.createElement('thead');
    }
    addRow(options) {
        const row = new CBS_TableHeadRow(options);
        this.append(row);
        return row;
    }
}
class CBS_TableFoot extends CBS_TableHead {
    constructor(options) {
        super(options);
        this.el = document.createElement('tfoot');
    }
    addRow(options) {
        const row = new CBS_TableFootRow(options);
        this.append(row);
        return row;
    }
}
class CBS_TableRow extends CBS_Element {
    constructor(options) {
        super(options);
        this.el = document.createElement('tr');
    }
    addData(options) {
        const d = new CBS_TableData(options);
        this.append(d);
        return d;
    }
}
class CBS_TableHeadRow extends CBS_Element {
    constructor(options) {
        super(options);
    }
    addHeader(options) {
        const d = new CBS_TableHeader(options);
        this.append(d);
        return d;
    }
}
class CBS_TableFootRow extends CBS_TableHeadRow {
    constructor(options) {
        super(options);
    }
}
class CBS_TableCaption extends CBS_Text {
    constructor(options) {
        super(options);
        this.el = document.createElement('caption');
    }
}
class CBS_SubTable extends CBS_Element {
    constructor(options) {
        super(options);
        this.el = document.createElement('table');
        this.addClass('table');
    }
}
class CBS_Table extends CBS_Component {
    static from(table) { }
    subcomponents = {};
    constructor(options) {
        super();
        this.el = document.createElement('div');
        if (options?.responsive)
            this.addClass('table-responsive');
        this.subcomponents.table = new CBS_SubTable(options);
        this.append(this.subcomponents.table);
    }
    addBody(options) {
        const body = new CBS_TableBody(options);
        this.subcomponents.table.append(body);
        return body;
    }
    addHead(options) {
        const head = new CBS_TableHead(options);
        this.subcomponents.table.append(head);
        return head;
    }
    addFoot(options) {
        const foot = new CBS_TableFoot(options);
        this.subcomponents.table.append(foot);
        return foot;
    }
    addCaption(options) {
        const caption = new CBS_TableCaption(options);
        this.subcomponents.table.append(caption);
        return caption;
    }
}
CBS.addElement('table', CBS_Table);
// █▀ ▄▀▄ █▀▄ █▄ ▄█ ▄▀▀ 
// █▀ ▀▄▀ █▀▄ █ ▀ █ ▄█▀ 
/**
 * Description placeholder
 *
 * @class CBS_Form
 * @typedef {CBS_Form}
 * @extends {CBS_Component}
 */
class CBS_Form extends CBS_Component {
    subcomponents = {
        container: new CBS_Container()
    };
    /**
     * Creates an instance of CBS_Form.
     *
     * @constructor
     * @param {?CBS_FormOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('form');
        this.subcomponents.submit = new CBS_Button({
            color: 'primary',
            attributes: {
                type: 'submit'
            }
        });
        this.subcomponents.submit.content = 'Submit';
        this.append(this.subcomponents.container);
    }
    /**
     * Description placeholder
     *
     * @param {string} type
     * @param {CBS_Options} options
     * @returns {CBS_Input}
     */
    createInput(name, type, options) {
        let i;
        switch (type) {
            case 'text':
                i = new CBS_TextInput(options);
                break;
            case 'password':
                i = new CBS_PasswordInput(options);
                break;
            case 'email':
                i = new CBS_EmailInput(options);
                break;
            case 'select':
                i = new CBS_SelectInput(options);
                break;
            case 'textarea':
                i = new CBS_TextareaInput(options);
                break;
            case 'checkbox':
                i = new CBS_Checkbox(options);
                break;
            case 'checkbox-group':
                i = new CBS_CheckboxGroup(options);
                break;
            case 'radio':
                i = new CBS_RadioGroup(options);
                break;
            case 'file':
                i = new CBS_FileInput(options);
                break;
            case 'range':
                i = new CBS_RangeInput(options);
                break;
            case 'color':
                i = new CBS_ColorInput(options);
                break;
            case 'date':
                i = new CBS_DateInput(options);
                break;
            default:
                i = new CBS_Input(options);
                break;
        }
        i.setAttribute('name', name);
        const c = new CBS_InputLabelContainer();
        c.input = i;
        c.label.text = name;
        return c;
    }
    get inputs() {
        const reduce = (acc, element) => {
            if (element instanceof CBS_Input) {
                if (acc[element.getAttribute('name')])
                    console.warn('Duplicate input, name:', element.getAttribute('name'), 'The previous will be overwritten');
                acc[element.getAttribute('name') || ''] = element;
            }
            else if (element instanceof CBS_InputLabelContainer) {
                if (acc[element.input.getAttribute('name')])
                    console.warn('Duplicate input, name:', element.input.getAttribute('name'), 'The previous will be overwritten');
                acc[element.input.getAttribute('name') || ''] = element;
            }
            else if (element instanceof CBS_Element) {
                element.components.forEach(el => reduce(acc, el));
            }
            return acc;
        };
        return this.components.reduce(reduce, {});
    }
    get value() {
        return Object.entries(this.inputs).reduce((acc, [name, input]) => {
            acc[name || ''] = input.value;
            return acc;
        }, {});
    }
    get mirrorValue() {
        return Object.entries(this.inputs).reduce((acc, [name, input]) => {
            acc[name || ''] = input.mirrorValue;
            return acc;
        }, {});
    }
    append(...elements) {
        super.append(...elements);
        elements.forEach(el => {
            if (el instanceof CBS_Input) {
                if (!el.getAttribute('name')) {
                    console.warn('CBS_Form.append: Input does not have "name" attribute');
                }
            }
        });
    }
}
CBS.addElement('form', CBS_Form);
/**
 * Description placeholder
 *
 * @class CBS_Input
 * @typedef {CBS_Input}
 * @extends {CBS_Element}
 * @implements {CBS_InputInterface}
 */
class CBS_Input extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_InputMirrorValueMap}
     */
    mirrorValues = {};
    /**
     * Description placeholder
     *
     * @type {?(value: any) => any}
     */
    getMirrorValue;
    /**
     * Description placeholder
     *
     * @type {HTMLInputElement}
     */
    _el = this.el; // just to trick compiler
    /**
     * Creates an instance of CBS_Input.
     *
     * @constructor
     * @param {?CBS_InputOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('input');
        this.addClass('form-control');
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get value() {
        return this._el.value;
    }
    set value(value) {
        this._el.value = value;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        return this.getMirrorValue ? this.getMirrorValue(this._el.value) : null;
    }
    /**
     * Description placeholder
     *
     * @param {(value: string) => any} fn
     * @returns {any) => void}
     */
    setMirrorValueGetter(fn) {
        this.getMirrorValue = fn;
    }
    /**
     * Description placeholder
     *
     * @param {string} name
     * @param {*} value
     */
    addMirrorValue(name, value) {
        this.mirrorValues[name] = value;
    }
}
CBS.addElement('input', CBS_Input);
/**
 * Description placeholder
 *
 * @class CBS_Label
 * @typedef {CBS_Label}
 * @extends {CBS_Element}
 */
class CBS_Label extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    #text = '';
    /**
     * Creates an instance of CBS_Label.
     *
     * @constructor
     * @param {?CBS_InputOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('label');
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text) {
        this.#text = text;
        this.el.innerHTML = text;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text() {
        return this.#text;
    }
}
CBS.addElement('label', CBS_Label);
/**
 * Description placeholder
 *
 * @class CBS_InputGroupLabel
 * @typedef {CBS_InputGroupLabel}
 * @extends {CBS_Element}
 */
class CBS_InputGroupLabel extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    #text = '';
    /**
     * Creates an instance of CBS_InputGroupLabel.
     *
     * @constructor
     * @param {?CBS_InputGroupOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('span');
        this.addClass('input-group-text');
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text) {
        this.#text = text;
        this.el.textContent = text;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text() {
        return this.#text;
    }
}
CBS.addElement('cbs-input-group-label', CBS_InputGroupLabel);
/**
 * Description placeholder
 *
 * @class CBS_InputGroup
 * @typedef {CBS_InputGroup}
 * @extends {CBS_Component}
 */
class CBS_InputGroup extends CBS_Component {
    // id: string = 'basic-addon-' + Math.floor(Math.random() * Date.now()).toString(16);
    /**
     * Creates an instance of CBS_InputGroup.
     *
     * @constructor
     * @param {?CBS_InputGroupOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('div');
        this.addClass('input-group');
        this.marginB = 3;
    }
    /**
     * Description placeholder
     *
     * @param {string} label
     */
    addGroupLabel(label) {
        const groupLabel = new CBS_InputGroupLabel();
        groupLabel.text = label;
        this.append(groupLabel);
        this.trigger('label:add');
    }
    /**
     * Description placeholder
     *
     * @param {(CBS_Input|CBS_InputLabelContainer)} input
     */
    addInput(input) {
        this.append(input);
        this.trigger('input:add');
    }
}
CBS.addElement('cbs-input-group', CBS_InputGroup);
/**
 * Description placeholder
 *
 * @class CBS_InputLabelContainer
 * @typedef {CBS_InputLabelContainer}
 * @extends {CBS_Component}
 * @implements {CBS_InputInterface}
 */
class CBS_InputLabelContainer extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents = {
        input: new CBS_Input(),
        label: new CBS_Label(),
        text: new CBS_FormText()
    };
    /**
     * Creates an instance of CBS_InputLabelContainer.
     *
     * @constructor
     * @param {CBS_Input} input
     * @param {CBS_Label} label
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super(options);
        this.append(this.subcomponents.label);
        this.append(this.subcomponents.input);
        this.append(this.subcomponents.text);
        // random string id
        this.id = 'input-label-container-' + CustomBootstrap.newID();
        this.subcomponents.input.id = this.id + '-input';
        this.subcomponents.label.setAttribute('for', this.subcomponents.input.id);
        this.type = 'label';
    }
    /**
     * Description placeholder
     *
     * @type {CBS_Input}
     */
    set input(input) {
        this.replace(this.subcomponents.input, input);
        this.subcomponents.input = input;
        this.subcomponents.input.id = this.id + '-input';
        this.subcomponents.label.setAttribute('for', this.subcomponents.input.id);
    }
    get input() {
        return this.subcomponents.input;
    }
    /**
     * Description placeholder
     *
     * @type {*}
     */
    set label(label) {
        this.replace(this.subcomponents.label, label);
        this.subcomponents.label = label;
        this.subcomponents.label.setAttribute('for', this.subcomponents.input.id);
    }
    get label() {
        return this.subcomponents.label;
    }
    #type = 'label';
    set type(type) {
        this.#type = type;
        const { input, label } = this.subcomponents;
        this.clearElements();
        switch (type) {
            case 'label':
                (() => {
                    this.classes = [
                        'form-group'
                    ];
                    this.marginB = 3;
                    this.append(label, input);
                })();
                break;
            case 'inline':
                (() => {
                    this.classes = [
                        'form-group'
                    ];
                    const row = new CBS_Row({
                        classes: [
                            'g-3',
                            'align-items-center'
                        ]
                    });
                    const labelCol = row.addCol();
                    labelCol.addClass('col-auto');
                    labelCol.append(label);
                    const inputCol = row.addCol();
                    inputCol.addClass('col-auto');
                    inputCol.append(input);
                    this.append(row);
                })();
                break;
            case 'floating':
                (() => {
                    this.classes = [
                        'form-floating'
                    ];
                    this.append(input, label);
                })();
                break;
        }
    }
    get type() {
        return this.#type;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get value() {
        return this.subcomponents.input.value;
    }
    set value(value) {
        this.subcomponents.input.value = value;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        return this.subcomponents.input.mirrorValue;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get formText() {
        return this.subcomponents.text.content;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set formText(content) {
        this.subcomponents.text.content = content;
    }
}
CBS.addElement('cbs-input-label-container', CBS_InputLabelContainer);
/**
 * Description placeholder
 *
 * @class CBS_CheckboxLabel
 * @typedef {CBS_CheckboxLabel}
 * @extends {CBS_Element}
 */
class CBS_CheckboxLabel extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    #text = '';
    /**
     * Creates an instance of CBS_CheckboxLabel.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('label');
        this.addClass('form-check-label');
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text) {
        this.#text = text;
        this.el.textContent = text;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text() {
        return this.#text;
    }
}
;
CBS.addElement('cbs-checkbox-label', CBS_CheckboxLabel);
/**
 * Description placeholder
 *
 * @class CBS_CheckboxInput
 * @typedef {CBS_CheckboxInput}
 * @extends {CBS_Input}
 */
class CBS_CheckboxInput extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {*}
     */
    #mirrorValue;
    /**
     * Creates an instance of CBS_CheckboxInput.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('input');
        this.addClass('form-check-input');
        this.setAttribute('type', 'checkbox');
        if (options?.mirrorValue) {
            this.#mirrorValue = options.mirrorValue;
        }
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get value() {
        return this.el.checked;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        if (this.getMirrorValue)
            return this.getMirrorValue(this.value);
        return this.#mirrorValue;
    }
    /**
     * Description placeholder
     */
    select() {
        this.el.indeterminate = false;
        this.el.checked = true;
    }
    /**
     * Description placeholder
     */
    deselect() {
        this.el.indeterminate = false;
        this.el.checked = false;
    }
    /**
     * Description placeholder
     */
    toggle() {
        this.el.indeterminate = false;
        this.el.checked = !this.el.checked;
    }
    /**
     * Description placeholder
     */
    disable() {
        this.el.disabled = true;
    }
    /**
     * Description placeholder
     */
    enable() {
        this.el.disabled = false;
    }
    /**
     * Description placeholder
     */
    semiCheck() {
        this.deselect();
        this.el.indeterminate = true;
    }
}
CBS.addElement('cbs-checkbox', CBS_CheckboxInput);
/**
 * Description placeholder
 *
 * @class CBS_Checkbox
 * @typedef {CBS_Checkbox}
 * @extends {CBS_Input}
 */
class CBS_Checkbox extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents = {
        input: new CBS_CheckboxInput(),
        label: new CBS_CheckboxLabel()
    };
    /**
     * Creates an instance of CBS_Checkbox.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options) {
        super(options);
        if (options?.label)
            this.text = options.label;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text) {
        this.subcomponents.label.text = text;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text() {
        return this.subcomponents.label.text;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get value() {
        return this.subcomponents.input.value;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        const input = this.subcomponents.input;
        return this.value ? input.mirrorValue : undefined;
    }
    /**
     * Description placeholder
     */
    select() {
        this.subcomponents.input.select();
    }
    /**
     * Description placeholder
     */
    deselect() {
        this.subcomponents.input.deselect();
    }
    /**
     * Description placeholder
     */
    toggle() {
        this.subcomponents.input.toggle();
    }
    /**
     * Description placeholder
     */
    disable() {
        this.subcomponents.input.disable();
    }
    /**
     * Description placeholder
     */
    enable() {
        this.subcomponents.input.enable();
    }
    /**
     * Description placeholder
     */
    semiCheck() {
        this.subcomponents.input.semiCheck();
    }
}
;
CBS.addElement('checkbox', CBS_Checkbox);
/**
 * Description placeholder
 *
 * @class CBS_CheckboxGroup
 * @typedef {CBS_CheckboxGroup}
 * @extends {CBS_Component}
 */
class CBS_CheckboxGroup extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_Checkbox[]}
     */
    checkboxes = [];
    /**
     * Creates an instance of CBS_CheckboxGroup.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('div');
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @param {?CBS_CheckboxOptions} [options]
     * @returns {CBS_Checkbox}
     */
    addCheckbox(value, options) {
        const c = new CBS_Checkbox(options);
        c.text = value;
        this.append(c);
        this.checkboxes.push(c);
        return c;
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    removeCheckbox(value) {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c)
            return false;
        this.removeElement(c);
        this.checkboxes.splice(this.checkboxes.indexOf(c), 1);
        return true;
    }
    /**
     * Description placeholder
     */
    clearCheckboxes() {
        this.checkboxes.forEach(checkbox => this.removeElement(checkbox));
        this.checkboxes = [];
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get value() {
        return this.checkboxes.reduce((acc, check) => {
            if (check.value)
                acc[check.text] = true;
            return acc;
        }, {});
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        if (this.getMirrorValue)
            return this.getMirrorValue(this.value);
        return this.checkboxes.reduce((acc, check) => {
            if (check.value)
                acc[check.text] = check.mirrorValue;
            return acc;
        }, {});
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    select(value) {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c)
            return undefined;
        c.select();
        return true;
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    isSelected(value) {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c)
            return undefined;
        return c.value;
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    deselect(value) {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c)
            return undefined;
        c.deselect();
        return true;
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    toggle(value) {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c)
            return undefined;
        c.toggle();
        return true;
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    disable(value) {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c)
            return undefined;
        c.disable();
        return true;
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    semiCheck(value) {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c)
            return undefined;
        c.semiCheck();
        return true;
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    enable(value) {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c)
            return undefined;
        c.enable();
        return true;
    }
    // Selecting
    /**
     * Description placeholder
     */
    selectAll() {
        this.checkboxes.forEach(checkbox => checkbox.select());
    }
    /**
     * Description placeholder
     */
    deselectAll() {
        this.checkboxes.forEach(checkbox => checkbox.deselect());
    }
    /**
     * Description placeholder
     */
    toggleAll() {
        this.checkboxes.forEach(checkbox => checkbox.toggle());
    }
    /**
     * Description placeholder
     */
    disableAll() {
        this.checkboxes.forEach(checkbox => checkbox.disable());
    }
    /**
     * Description placeholder
     */
    enableAll() {
        this.checkboxes.forEach(checkbox => checkbox.enable());
    }
    /**
     * Description placeholder
     */
    semiCheckAll() {
        this.checkboxes.forEach(checkbox => checkbox.semiCheck());
    }
}
;
CBS.addElement('input-checkbox', CBS_CheckboxInput);
/**
 * Description placeholder
 *
 * @class CBS_ColorInput
 * @typedef {CBS_ColorInput}
 * @extends {CBS_Input}
 */
class CBS_ColorInput extends CBS_Input {
    /**
     * Creates an instance of CBS_ColorInput.
     *
     * @constructor
     * @param {?CBS_ColorInputOptions} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('form-control');
        this.setAttribute('type', 'color');
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value() {
        return this.el.value;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value) {
        this.el.value = value;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        if (this.getMirrorValue)
            return this.getMirrorValue(this.value);
        return null;
    }
}
CBS.addElement('input-color', CBS_ColorInput);
/**
 * Description placeholder
 *
 * @class CBS_DateInput
 * @typedef {CBS_DateInput}
 * @extends {CBS_Input}
 */
class CBS_DateInput extends CBS_Input {
    /**
     * Creates an instance of CBS_DateInput.
     *
     * @constructor
     * @param {?CBS_DateInputOptions} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('form-control');
        this.setAttribute('type', 'date');
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value() {
        return this.el.value;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value) {
        this.el.value = value;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {Date}
     */
    get mirrorValue() {
        if (this.getMirrorValue)
            return this.getMirrorValue(this.value);
        return new Date(this.value);
    }
}
CBS.addElement('input-date', CBS_DateInput);
/**
 * Description placeholder
 *
 * @class CBS_EmailInput
 * @typedef {CBS_EmailInput}
 * @extends {CBS_Input}
 */
class CBS_EmailInput extends CBS_Input {
    /**
     * Creates an instance of CBS_EmailInput.
     *
     * @constructor
     * @param {?CBS_EmailInputOptions} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('form-control');
        this.setAttribute('type', 'email');
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value() {
        return this.el.value;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value) {
        this.el.value = value;
    }
    /**
     * Description placeholder
     *
     * @async
     * @returns {unknown}
     */
    async isValid() {
        // TODO: check if the email is a valid email
        return true;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {any}
     */
    get mirrorValue() {
        if (this.getMirrorValue)
            return this.getMirrorValue(this.value);
        return this.mirrorValues[this.value];
    }
}
CBS.addElement('input-email', CBS_EmailInput);
/**
 * Description placeholder
 *
 * @class CBS_FileInput
 * @typedef {CBS_FileInput}
 * @extends {CBS_Input}
 */
class CBS_FileInput extends CBS_Input {
    /**
     * Creates an instance of CBS_FileInput.
     *
     * @constructor
     * @param {?CBS_FileInputOptions} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('form-control');
        this.setAttribute('type', 'file');
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {FileList}
     */
    get value() {
        return this.el.files;
    }
    /**
     * Description placeholder
     */
    clearFiles() {
        // clear all files from input
        try {
            this.el.value = '';
        }
        catch (e) {
            console.warn('You must be using an older browser, attempting to clear files again...');
            this.setAttribute('type', 'text');
            this.setAttribute('type', 'file');
        }
    }
    /**
     * Description placeholder
     *
     * @async
     * @returns {Promise<ReadableStream[]>}
     */
    async getFileStreams() {
        return new Promise((res, rej) => {
            const files = this.value;
            const streams = Array.from(files).map((f) => {
                return f.stream();
            });
            res(streams);
        });
    }
}
CBS.addElement('input-file', CBS_FileInput);
/**
 * Description placeholder
 *
 * @class CBS_FormText
 * @typedef {CBS_FormText}
 * @extends {CBS_Element}
 */
class CBS_FormText extends CBS_Element {
    /**
     * Creates an instance of CBS_FormText.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('small');
        this.addClass('form-text');
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set content(content) {
        this.el.innerHTML = content;
        if (content)
            this.show();
        else
            this.hide();
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get content() {
        return this.el.innerHTML;
    }
}
CBS.addElement('cbs-form-text', CBS_FormText);
/**
 * Description placeholder
 *
 * @class CBS_NumberInput
 * @typedef {CBS_NumberInput}
 * @extends {CBS_Input}
 */
class CBS_NumberInput extends CBS_Input {
    /**
     * Creates an instance of CBS_NumberInput.
     *
     * @constructor
     * @param {?CBS_NumberInputOptions} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('form-control');
        this.setAttribute('type', 'number');
    }
    get value() {
        return +this.el.value;
    }
    set value(value) {
        this.el.value = value.toString();
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {any}
     */
    get mirrorValue() {
        if (this.getMirrorValue)
            return this.getMirrorValue(this.value);
        return this.mirrorValues[this.value];
    }
}
CBS.addElement('input-number', CBS_NumberInput);
/**
 * Description placeholder
 *
 * @class CBS_PasswordInput
 * @typedef {CBS_PasswordInput}
 * @extends {CBS_Input}
 */
class CBS_PasswordInput extends CBS_Input {
    /**
     * Creates an instance of CBS_PasswordInput.
     *
     * @constructor
     * @param {?CBS_PasswordInputOptions} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('form-control');
        this.setAttribute('type', 'password');
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value() {
        return this.el.value;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value) {
        this.el.value = value;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {any}
     */
    get mirrorValue() {
        if (this.getMirrorValue)
            return this.getMirrorValue(this.value);
        return this.mirrorValues[this.value];
    }
}
CBS.addElement('input-password', CBS_PasswordInput);
class CBS_RadioLabel extends CBS_CheckboxLabel {
    /**
     * Creates an instance of CBS_RadioLabel.
     *
     * @constructor
     * @param {?CBS_RadioOptions} [options]
     */
    constructor(options) {
        super(options);
    }
}
CBS.addElement('cbs-radio-label', CBS_RadioLabel);
/**
 * Description placeholder
 *
 * @class CBS_RadioInput
 * @typedef {CBS_RadioInput}
 * @extends {CBS_Input}
 */
class CBS_RadioInput extends CBS_Input {
    // #mirrorValue: any;
    /**
     * Creates an instance of CBS_RadioInput.
     *
     * @constructor
     * @param {?CBS_RadioOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('input');
        this.addClass('form-check-input');
        this.setAttribute('type', 'radio');
        // if (options?.mirrorValue) {
        //     this.#mirrorValue = options.mirrorValue;
        // }
    }
    // get mirrorValue() {
    //     return this.#mirrorValue;
    // }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get value() {
        return this.el.checked;
    }
    /**
     * Description placeholder
     */
    select() {
        this.el.checked = true;
    }
    /**
     * Description placeholder
     */
    deselect() {
        this.el.checked = false;
    }
    /**
     * Description placeholder
     */
    disable() {
        this.el.disabled = true;
    }
    /**
     * Description placeholder
     */
    enable() {
        this.el.disabled = false;
    }
}
CBS.addElement('cbs-radio-input', CBS_RadioInput);
/**
 * Description placeholder
 *
 * @class CBS_Radio
 * @typedef {CBS_Radio}
 * @extends {CBS_Input}
 */
class CBS_Radio extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents = {
        label: new CBS_RadioLabel(),
        input: new CBS_RadioInput()
    };
    /**
     * Creates an instance of CBS_Radio.
     *
     * @constructor
     * @param {?CBS_RadioOptions} [options]
     */
    constructor(options) {
        super(options);
        if (options?.label)
            this.text = options.label;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text) {
        this.subcomponents.label.text = text;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text() {
        return this.subcomponents.label.text;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get value() {
        return this.subcomponents.input.value;
    }
    // get mirrorValue() {
    //     return (this.subcomponents.input as CBS_RadioInput).mirrorValue;
    // }
    /**
     * Description placeholder
     */
    select() {
        this.subcomponents.input.select();
    }
    /**
     * Description placeholder
     */
    deselect() {
        this.subcomponents.input.deselect();
    }
    /**
     * Description placeholder
     */
    disable() {
        this.subcomponents.input.disable();
    }
    /**
     * Description placeholder
     */
    enable() {
        this.subcomponents.input.enable();
    }
}
;
CBS.addElement('cbs-radio', CBS_Radio);
/**
 * Description placeholder
 *
 * @class CBS_RadioGroup
 * @typedef {CBS_RadioGroup}
 * @extends {CBS_Input}
 */
class CBS_RadioGroup extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_Radio[]}
     */
    radios = [];
    /**
     * Creates an instance of CBS_RadioGroup.
     *
     * @constructor
     * @param {?CBS_RadioOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('div');
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @param {?CBS_RadioOptions} [options]
     * @returns {CBS_Radio}
     */
    addRadio(value, options) {
        const r = new CBS_Radio(options);
        r.text = value;
        this.append(r);
        this.radios.push(r);
        return r;
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    removeRadio(value) {
        const r = this.radios.find(radio => radio.text === value);
        if (!r)
            return false;
        this.removeElement(r);
        this.radios.splice(this.radios.indexOf(r), 1);
        return true;
    }
    /**
     * Description placeholder
     */
    clearRadios() {
        this.radios.forEach(radio => this.removeElement(radio));
        this.radios = [];
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {string}
     */
    get value() {
        const r = this.radios.find(radio => radio.value);
        return r ? r.text : '';
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        if (this.getMirrorValue)
            return this.getMirrorValue(this.value);
        const r = this.radios.find(radio => radio.value);
        return r ? r.mirrorValue : null;
    }
    /**
     * Description placeholder
     */
    deselectAll() {
        this.radios.forEach(radio => radio.deselect());
    }
    /**
     * Description placeholder
     */
    disableAll() {
        this.radios.forEach(radio => radio.disable());
    }
    /**
     * Description placeholder
     */
    enableAll() {
        this.radios.forEach(radio => radio.enable());
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    select(value) {
        const r = this.radios.find(radio => radio.text === value);
        if (r) {
            this.deselectAll();
            r.select();
            return true;
        }
        return false;
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    disable(value) {
        const r = this.radios.find(radio => radio.text === value);
        if (r) {
            r.disable();
            return true;
        }
        return false;
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    enable(value) {
        const r = this.radios.find(radio => radio.text === value);
        if (r) {
            r.enable();
            return true;
        }
        return false;
    }
}
CBS.addElement('input-radio', CBS_RadioInput);
/**
 * Description placeholder
 *
 * @class CBS_RangeInput
 * @typedef {CBS_RangeInput}
 * @extends {CBS_Input}
 */
class CBS_RangeInput extends CBS_Input {
    /**
     * Creates an instance of CBS_RangeInput.
     *
     * @constructor
     * @param {?CBS_RangeInputOptions} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('form-control');
        this.setAttribute('type', 'range');
        if (options?.min)
            this.setAttribute('min', options.min.toString());
        else
            this.setAttribute('min', '0');
        if (options?.max)
            this.setAttribute('max', options.max.toString());
        else
            this.setAttribute('max', '100');
        if (options?.step)
            this.setAttribute('step', options.step.toString());
        else
            this.setAttribute('step', '1');
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get value() {
        return +this.el.value;
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set value(value) {
        this.el.value = value.toString();
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        if (this.getMirrorValue)
            return this.getMirrorValue(this.value);
        return this.mirrorValues[this.value];
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get min() {
        return this.getAttribute('min') ? +this.getAttribute('min') : 0;
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set min(min) {
        this.setAttribute('min', min.toString());
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get max() {
        return this.getAttribute('max') ? +this.getAttribute('max') : 100;
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set max(max) {
        this.setAttribute('max', max.toString());
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get step() {
        return this.getAttribute('step') ? +this.getAttribute('step') : 1;
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set step(step) {
        this.setAttribute('step', step.toString());
    }
}
CBS.addElement('input-range', CBS_RangeInput);
class CBS_SelectOption extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    value;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    text;
    /**
     * Description placeholder
     *
     * @type {*}
     */
    mirrorValue;
    /**
     * Creates an instance of CBS_SelectOption.
     *
     * @constructor
     * @param {string} text
     * @param {string} value
     * @param {*} [mirrorValue=null]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('option');
        this.value = options?.value || '';
        this.text = options?.text || '';
        this.mirrorValue = options?.mirrorValue || null;
    }
    /**
     * Description placeholder
     */
    select() {
        this.setAttribute('selected', '');
    }
    /**
     * Description placeholder
     */
    deselect() {
        this.removeAttribute('selected');
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {string}
     */
    get selected() {
        return this.getAttribute('selected');
    }
    /**
     * Description placeholder
     */
    disable() {
        this.setAttribute('disabled', '');
    }
    /**
     * Description placeholder
     */
    enable() {
        this.removeAttribute('disabled');
    }
}
/**
 * Description placeholder
 *
 * @class CBS_SelectInput
 * @typedef {CBS_SelectInput}
 * @extends {CBS_Input}
 */
class CBS_SelectInput extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_SelectOption[]}
     */
    selectOptions = [];
    /**
     * Creates an instance of CBS_SelectInput.
     *
     * @constructor
     * @param {?CBS_SelectOptions} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('form-select');
        this.el = document.createElement('select');
    }
    /**
     * Description placeholder
     *
     * @param {string} text
     * @param {string} value
     * @param {*} [mirrorValue=null]
     * @returns {(CBS_SelectOption|null)}
     */
    addOption(text, value, mirrorValue = null) {
        const has = this.selectOptions.find(option => option.value === value);
        if (has) {
            return null;
        }
        const option = new CBS_SelectOption({
            text,
            value,
            mirrorValue
        });
        this.selectOptions.push(option);
        this.append(option);
        return option;
    }
    /**
     * Description placeholder
     *
     * @param {(string|CBS_SelectOption)} valueOrOption
     */
    removeOption(valueOrOption) {
        if (typeof valueOrOption === 'string') {
            const option = this.selectOptions.find(option => option.value === valueOrOption);
            if (option) {
                this.selectOptions.splice(this.selectOptions.indexOf(option), 1);
                this.removeElement(option);
            }
        }
        else {
            this.selectOptions.splice(this.selectOptions.indexOf(valueOrOption), 1);
            this.removeElement(valueOrOption);
        }
    }
    /**
     * Description placeholder
     *
     * @param {string} value
     */
    select(value) {
        this.selectOptions.forEach(option => {
            if (option.value === value) {
                option.select();
            }
            else {
                option.deselect();
            }
        });
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {string}
     */
    get value() {
        return this.el.value;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        const option = this.selectOptions.find(option => option.value === this.value);
        if (option) {
            return option.mirrorValue;
        }
        return null;
    }
}
CBS.addElement('input-select', CBS_SelectInput);
/**
 * Description placeholder
 *
 * @class CBS_TextInput
 * @typedef {CBS_TextInput}
 * @extends {CBS_Input}
 */
class CBS_TextInput extends CBS_Input {
    /**
     * Creates an instance of CBS_TextInput.
     *
     * @constructor
     * @param {?CBS_TextInputOptions} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('form-control');
        this.setAttribute('type', 'text');
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value() {
        return this.el.value;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value) {
        this.el.value = value;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        return this.mirrorValues[this.value];
    }
}
CBS.addElement('input-text', CBS_TextInput);
/**
 * Description placeholder
 *
 * @class CBS_TextAreaInput
 * @typedef {CBS_TextareaInput}
 * @extends {CBS_Input}
 */
class CBS_TextareaInput extends CBS_Input {
    /**
     * Creates an instance of CBS_TextAreaInput.
     *
     * @constructor
     * @param {?CBS_TextareaOptions} [options]
     */
    constructor(options) {
        super(options);
        this.addClass('form-control');
        this.el = document.createElement('textarea');
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value() {
        return this.el.value;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value) {
        this.el.value = value;
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get columns() {
        return this.el.cols;
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set columns(value) {
        this.el.cols = value;
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get rows() {
        return this.el.rows;
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set rows(value) {
        this.el.rows = value;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {any}
     */
    get mirrorValue() {
        if (this.getMirrorValue)
            return this.getMirrorValue(this.value);
        return this.mirrorValues[this.value];
    }
}
CBS.addElement('input-textarea', CBS_TextareaInput);
/**
 * Item for CBS_List
 *
 * @class CBS_ListItem
 * @typedef {CBS_ListItem}
 * @extends {CBS_Component}
 */
class CBS_ListItem extends CBS_Component {
    /**
     * Creates an instance of CBS_ListItem
     *
     * @constructor
     * @param {?CBS_ListItemOptions} [options]
     */
    constructor(options) {
        super(options);
        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'list-group-item'
            ],
            attributes: {
                ...options?.attributes,
                type: 'list-item'
            }
        };
        this.el = document.createElement('li');
    }
}
CBS.addElement('li', CBS_ListItem);
/**
 * <ul> or <ol> element as a component
 *
 * @class CBS_List
 * @typedef {CBS_List}
 * @extends {CBS_Component}
 */
class CBS_List extends CBS_Component {
    /**
     * Creates an instance of CBS_List
     *
     * @constructor
     * @param {?CBS_ListOptions} [options]
     */
    constructor(options) {
        super(options);
        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'list-group'
            ],
            attributes: {
                ...options?.attributes,
                type: 'list'
            }
        };
        if (this.options.ordered) {
            this.el = document.createElement('ol');
        }
        else {
            this.el = document.createElement('ul');
        }
    }
    /**
     * Sets the options for the CBS_List component
     * Calls the super method and then sets the element to either an <ol> or <ul> element
     *
     * @type {CBS_ListOptions}
     */
    set options(options) {
        if (this.options.ordered) {
            this._el = document.createElement('ol');
        }
        else {
            this._el = document.createElement('ul');
        }
        super.options = options;
    }
    get options() {
        return this._options;
    }
    /**
     * Changes element to an <ol> element or <ul> element
     *
     * @type {boolean}
     */
    set ordered(ordered) {
        this.options = {
            ...this.options,
            ordered
        };
    }
    /**
     * Returns whether the element is an <ol> element or <ul> element
     *
     * @type {boolean}
     */
    get ordered() {
        return this.options?.ordered || false;
    }
}
CBS.addElement('list', CBS_List);
/**
 * Description placeholder
 *
 * @class CBS_AudioSource
 * @typedef {CBS_AudioSource}
 * @extends {CBS_Element}
 */
class CBS_AudioSource extends CBS_Element {
    /**
     * Creates an instance of CBS_AudioSource.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('source');
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set src(src) {
        this.el.src = src;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get src() {
        return this.el.src;
    }
}
/**
 * Description placeholder
 *
 * @class CBS_AudioElement
 * @typedef {CBS_AudioElement}
 * @extends {CBS_Component}
 */
class CBS_AudioElement extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents = {
        source: new CBS_AudioSource()
    };
    /**
     * Creates an instance of CBS_AudioElement.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('audio');
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {number}
     */
    get fadeTime() {
        return this.options?.fadeTime || 100;
    }
    /**
     * Description placeholder
     *
     * @async
     * @returns {*}
     */
    async play() {
        this.volume = 0;
        this.el.play();
        this.fadeIn(100).catch(() => { });
    }
    /**
     * Description placeholder
     *
     * @async
     * @returns {*}
     */
    async pause() {
        await this.fadeOut(100).catch(() => { });
        this.el.pause();
    }
    /**
     * Description placeholder
     *
     * @async
     * @returns {*}
     */
    async stop() {
        await this.pause();
        this.currentTime = 0;
    }
    /**
     * Description placeholder
     *
     * @async
     * @param {number} duration
     * @returns {Promise<void>}
     */
    async fadeIn(duration) {
        return new Promise((resolve, reject) => {
            let volume = 0;
            let interval = duration / this.fadeTime;
            let increment = 1 / this.fadeTime;
            let fadeInInterval = setInterval(() => {
                if (volume >= 1) {
                    clearInterval(fadeInInterval);
                    resolve();
                }
                else {
                    volume += increment;
                    this.volume = volume;
                }
            }, interval);
        });
    }
    /**
     * Description placeholder
     *
     * @async
     * @param {number} duration
     * @returns {Promise<void>}
     */
    async fadeOut(duration) {
        return new Promise((res, rej) => {
            let interval = duration / this.fadeTime;
            let increment = 1 / this.fadeTime;
            let fadeOutInterval = setInterval(() => {
                if (this.volume <= 0) {
                    clearInterval(fadeOutInterval);
                    res();
                }
                else {
                    this.volume -= increment;
                }
            }, interval);
        });
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set volume(volume) {
        this.el.volume = volume;
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get volume() {
        return this.el.volume;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set src(src) {
        this.subcomponents.source.src = src;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get src() {
        return this.subcomponents.source.src;
    }
    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    set controls(controls) {
        this.el.controls = controls;
    }
    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    get controls() {
        return this.el.controls;
    }
    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    set autoplay(autoplay) {
        this.el.autoplay = autoplay;
    }
    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    get autoplay() {
        return this.el.autoplay;
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    #duration = 0;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {Promise<number>}
     */
    get duration() {
        return new Promise((res, rej) => {
            if (this.#duration) {
                res(this.#duration);
            }
            else {
                this.on('loadedmetadata', () => {
                    this.#duration = this.el.duration;
                    res(this.#duration);
                });
            }
        });
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get currentTime() {
        return this.el.currentTime;
    }
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set currentTime(currentTime) {
        this.el.currentTime = currentTime;
    }
    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get paused() {
        return this.el.paused;
    }
}
/**
 * Description placeholder
 *
 * @class CBS_AudioPlayhead
 * @typedef {CBS_AudioPlayhead}
 * @extends {CBS_Element}
 */
class CBS_AudioPlayhead extends CBS_Element {
    /**
     * Creates an instance of CBS_AudioPlayhead.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options) {
        super(options);
        this.options = {
            ...this.options,
            classes: [
                ...(this.options?.classes || [])
            ],
            style: {
                ...this.options?.style,
                width: '8px',
                height: '8px',
                '-webkit-border-radius': '50%',
                'border-radius': '50%',
                background: 'black',
                cursor: 'pointer',
                'margin-top': '-3px'
            }
        };
        this.el = document.createElement('div');
    }
}
/**
 * Description placeholder
 *
 * @class CBS_AudioTimeline
 * @typedef {CBS_AudioTimeline}
 * @extends {CBS_Component}
 */
class CBS_AudioTimeline extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents = {
        playhead: new CBS_AudioPlayhead()
    };
    /**
     * Creates an instance of CBS_AudioTimeline.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options) {
        super(options);
        this.options = {
            ...this.options,
            classes: [
                ...(this.options?.classes || []),
                'mt-2',
                'ms-1',
                'rounded'
            ],
            style: {
                ...this.options?.style,
                width: '90%',
                height: '2px',
                float: 'left',
                background: 'rgba(0, 0, 0, 0.3)',
            }
        };
        this.el = document.createElement('div');
    }
    /**
     * Description placeholder
     *
     * @async
     * @param {CBS_AudioElement} audio
     * @returns {*}
     */
    async update(audio) {
        let playhead = this.subcomponents.playhead;
        let percentage = audio.currentTime / (await audio.duration) * 100;
        playhead.el.style.left = `${percentage}%`;
    }
    /**
     * Description placeholder
     *
     * @param {number} clientX
     * @returns {number}
     */
    getProgress(clientX) {
        let playhead = this.subcomponents.playhead;
        return (clientX - this.el.offsetLeft) / (this.el.offsetWidth - playhead.el.offsetWidth);
    }
}
CBS_AudioTimeline.addCustomEvent('playhead.move');
/**
 * Description placeholder
 *
 * @class CBS_AudioButton
 * @typedef {CBS_AudioButton}
 * @extends {CBS_Element}
 */
class CBS_AudioButton extends CBS_Component {
    /**
     * Creates an instance of CBS_AudioButton.
     *
     * @constructor
     * @param {string} type
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(type, options) {
        super(options);
        this.options = {
            ...this.options,
            classes: ['material-icons'],
            style: {
                ...this.options?.style,
                cursor: 'pointer',
                float: 'left',
                'margin-top': '12px'
            }
        };
        this.el = document.createElement('i');
        switch (type) {
            case 'toggle':
                this.el.innerHTML = 'play_arrow';
                break;
            case 'stop':
                this.el.innerHTML = 'stop';
                break;
        }
    }
}
/**
 * Description placeholder
 *
 * @class CBS_AudioPlayer
 * @typedef {CBS_AudioPlayer}
 * @extends {CBS_Component}
 */
class CBS_AudioPlayer extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents = {
        audio: new CBS_AudioElement(),
        toggleButton: new CBS_AudioButton('toggle'),
        stopButton: new CBS_AudioButton('stop'),
        timeline: new CBS_AudioTimeline()
    };
    /**
     * Creates an instance of CBS_AudioPlayer.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('div');
        const { audio, toggleButton, stopButton, timeline } = this.subcomponents;
        this.append(audio, toggleButton, stopButton, timeline);
        const toggleButtonContent = toggleButton.subcomponents.content;
        const pause = () => {
            toggleButtonContent.icon = 'play_arrow';
            toggleButtonContent.off('click', pause);
            toggleButtonContent.on('click', play);
            audio.pause();
        };
        const play = () => {
            toggleButtonContent.icon = 'pause';
            toggleButtonContent.off('click', play);
            toggleButtonContent.on('click', pause);
            audio.play();
        };
        const stop = () => {
            audio.stop();
            pause();
        };
        audio.on('timeupdate', () => {
            timeline.update(audio);
        });
        timeline.on('click', async (e) => {
            const progress = timeline.getProgress(e.clientX);
            audio.currentTime = progress * (await audio.duration);
        });
        const playhead = timeline.subcomponents.playhead;
        playhead.on('mousedown', async (e) => {
            audio.pause();
            playhead.on('mousemove', async (e) => {
                const progress = timeline.getProgress(e.clientX);
                audio.currentTime = progress * (await audio.duration);
                timeline.update(audio);
            });
            playhead.on('mouseup', async (e) => {
                playhead.off('mousemove');
                audio.play();
            });
        });
        toggleButton.on('click', play);
        stopButton.on('click', stop);
    }
}
/**
 * Description placeholder
 *
 * @class CBS_AudioCardBody
 * @typedef {CBS_AudioCardBody}
 * @extends {CBS_CardBody}
 */
class CBS_AudioCardBody extends CBS_CardBody {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents = {
        title: new CBS_H5(),
        subtitle: new CBS_Component(),
        player: new CBS_AudioPlayer()
    };
    /**
     * Creates an instance of CBS_AudioCardBody.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('div');
        this.append(this.subcomponents.title, this.subcomponents.subtitle, this.subcomponents.player);
    }
}
/**
 * Description placeholder
 *
 * @class CBS_AudioCard
 * @typedef {CBS_AudioCard}
 * @extends {CBS_Card}
 */
class CBS_AudioCard extends CBS_Card {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents = {
        image: new CBS_Image(),
        body: new CBS_AudioCardBody()
    };
    /**
     * Creates an instance of CBS_AudioCard.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('div');
        this.append(this.subcomponents.image, this.subcomponents.body);
    }
}
CBS.addElement('audio-card', CBS_AudioCard);
CBS.addElement('audio', CBS_AudioElement);
/**
 * Description placeholder
 *
 * @class CBS_Image
 * @typedef {CBS_Image}
 * @extends {CBS_Component}
 */
class CBS_Image extends CBS_Component {
    /**
     * Creates an instance of CBS_Image.
     *
     * @constructor
     * @param {?CBS_ImageOptions} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('img');
    }
    /**
     * Description placeholder
     *
     * @type {CBS_ImageOptions}
     */
    set options(options) {
        super.options = options;
        this.el.src = options.src || '';
    }
    get options() {
        return this._options;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set src(src) {
        this.options = {
            ...this.options,
            src
        };
    }
}
CBS.addElement('picture', CBS_Image);
class CBS_SVG extends CBS_Element {
    constructor(options) {
        super(options);
        this.addClass('bi', 'flex-shrink-0', 'me-2');
        this.setAttribute('role', 'img');
        // default size
        this.setAttribute('width', '24');
        this.setAttribute('height', '24');
        this.setAttribute('fill', 'currentColor');
    }
}
CBS.addElement('svg', CBS_SVG);
// create bootstrap svg templates
(() => {
    const svgs = {
        success: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </symbol>
            </svg>
        `,
        info: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </symbol>
            </svg>
        `,
        warning: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </symbol>
            </svg>
        `
    };
    for (const [key, value] of Object.entries(svgs)) {
        const svg = new CBS_SVG();
        svg.append(value);
        CBS_SVG.addTemplate(key, svg);
    }
})();
class CBS_Video extends CBS_Component {
    constructor(options) {
        super(options);
    }
}
CBS.addElement('video', CBS_Video);
/**
 * Description placeholder
 *
 * @class CBS_ContextMenuItem
 * @typedef {CBS_ContextMenuItem}
 * @extends {CBS_Paragraph}
 */
class CBS_ContextMenuItem extends CBS_Paragraph {
    /**
     * Creates an instance of CBS_ContextMenuItem.
     *
     * @constructor
     * @param {CBS_ContextmenuSelectOptions} options
     * @param {() => void} callback
     */
    constructor(options, callback) {
        super({
            style: {
                cursor: 'pointer'
            }
        });
        this.content = options.name;
        if (options.color) {
            this.addClass(`text-${options.color}`);
            this.color = options.color;
        }
        this.addClass('fw-normal');
        this.on('click', callback);
        this.on('mouseover', () => this.addClass('bg-secondary'));
        this.on('mouseout', () => this.removeClass('bg-secondary'));
        // touch events
        this.on('touchstart', () => this.addClass('bg-secondary'));
        this.on('touchend', () => this.removeClass('bg-secondary'));
        this.on('touchcancel', () => this.removeClass('bg-secondary'));
        this.on('touchmove', () => this.removeClass('bg-secondary'));
        this.on('touchleave', () => this.removeClass('bg-secondary'));
        this.on('touchenter', () => this.addClass('bg-secondary'));
        this.on('touchforcechange', () => this.removeClass('bg-secondary'));
        this.on('touchend', () => this.removeClass('bg-secondary'));
    }
}
/**
 * Description placeholder
 *
 * @class CBS_ContextmenuSection
 * @typedef {CBS_ContextmenuSection}
 * @extends {CBS_Component}
 */
class CBS_ContextmenuSection extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ContextMenuItem[]}
     */
    items = [];
    /**
     * Description placeholder
     *
     * @type {?CBS_Color}
     */
    color;
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents = {
        title: new CBS_H6()
    };
    /**
     * Creates an instance of CBS_ContextmenuSection.
     *
     * @constructor
     * @param {CBS_ContextmenuSelectOptions} options
     */
    constructor(options) {
        super();
        this.el = document.createElement('div');
        if (options.color) {
            this.addClass(`bg-${options.color}`);
            this.color = options.color;
        }
        this.addClass('fw-bold');
        this.content = options.name;
    }
    /**
     * Description placeholder
     *
     * @param {string} name
     * @param {() => void} callback
     * @returns {CBS_ContextMenuItem}
     */
    addItem(name, callback) {
        const item = new CBS_ContextMenuItem({ name, color: this.color }, callback);
        this.items.push(item);
        this.append(item);
        return item;
    }
    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {boolean}
     */
    removeItem(name) {
        const index = this.items.findIndex((item) => item.text === name);
        if (index >= 0) {
            this.items.splice(index, 1);
            this.removeElement(this.items[index]);
            return true;
        }
        return false;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set name(name) {
        this.subcomponents.title.text = name;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get name() {
        return this.subcomponents.title.text;
    }
}
class CBS_SubContextmenu extends CBS_Component {
    constructor(options) {
        super(options);
        this.addClass('position-absolute', 'rounded', 'shadow', 'bg-light');
        this.padding = 2;
        this.hide();
        if (options?.color) {
            options.color = CBS_Color.light;
        }
    }
    /**
     * Description placeholder
     *
     * @type {?CBS_Color}
     */
    color;
    /**
     * Description placeholder
     *
     * @type {CBS_ContextmenuOptions}
     */
    set options(options) {
        super.options = options;
        const { color } = this;
        if (color)
            this.removeClass(`bg-${color}`);
        if (options.color) {
            this.color = options.color;
            this.addClass(`bg-${options.color}`);
        }
    }
    get options() {
        return this._options;
    }
}
/**
 * Description placeholder
 *
 * @class CBS_Contextmenu
 * @typedef {CBS_Contextmenu}
 * @extends {CBS_Component}
 */
class CBS_Contextmenu extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ContextmenuSections}
     */
    sections = {};
    /**
     * Description placeholder
     *
     * @type {?(CBS_Element|HTMLElement)}
     */
    actionElement;
    ignoreList = [];
    subcomponents = {};
    /**
     * Creates an instance of CBS_Contextmenu.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super();
        this.ignoreList = options?.ignoreList || [];
        this.subcomponents.menu = new CBS_SubContextmenu(options);
        this.append(this.subcomponents.menu);
        this.addClass('position-relative');
    }
    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {CBS_ContextmenuSection}
     */
    addSection(name) {
        if (this.sections[name])
            console.warn('There is already a section with the name:', name, 'on your context menu. It has been replaced');
        this.sections[name] = new CBS_ContextmenuSection({ color: this.subcomponents.menu.color, name });
        this.subcomponents.menu.append(this.sections[name]);
        return this.sections[name];
    }
    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {boolean}
     */
    removeSection(name) {
        if (this.sections[name]) {
            delete this.sections[name];
            this.subcomponents.menu.removeElement(this.sections[name]);
            return true;
        }
        return false;
    }
    /**
     * Description placeholder
     *
     * @param {(CBS_Element|HTMLElement)} element
     */
    apply(element) {
        try {
            if (this.actionElement) {
                if (this.actionElement instanceof CBS_Element) {
                    this.actionElement.off('contextmenu', this._show.bind(this));
                }
                else {
                    this.actionElement.removeEventListener('contextmenu', this.show.bind(this));
                }
            }
            if (element instanceof CBS_Element) {
                element.on('contextmenu', this._show.bind(this));
            }
            else {
                element.addEventListener('contextmenu', this._show.bind(this));
            }
        }
        catch {
            console.error('Error applying contextmenu to:', element, 'Was it an HTML element or CBS element?');
        }
    }
    /**
     * Description placeholder
     *
     * @private
     * @param {Event} e
     */
    _show(e) {
        e.preventDefault();
        document.body.appendChild(this.el);
        this.style = {
            '--animate-duration': '0.2s'
        };
        this.subcomponents.menu.addClass('animate__animated', 'animate__faster');
        const { x, y } = this.getXY(e);
        const { width, height } = this.subcomponents.menu.el.getBoundingClientRect();
        const { innerWidth, innerHeight } = window;
        let up, left;
        if (x + width > innerWidth) {
            this.subcomponents.menu.el.style.left = `${x - width}px`;
            left = 'Right';
        }
        else {
            this.subcomponents.menu.el.style.left = `${x}px`;
            left = 'Left';
        }
        if (y + height < innerHeight) {
            this.subcomponents.menu.el.style.top = `${y - height}px`;
            up = 'Down';
        }
        else {
            this.subcomponents.menu.el.style.top = `${y}px`;
            up = 'Up';
        }
        this.subcomponents.menu.addClass(`animate__rotateIn${up}${left}`);
        this.subcomponents.menu.show();
        // const animateCB = () => {
        //     this.subcomponents.menu.removeClass(`animate__rotateIn${up}${left}`, 'animate__animated', 'animate__faster');
        //     this.off('animationend', animateCB);
        // }
        // setTimeout(animateCB, 200);
        // this.subcomponents.menu.on('animationend', animateCB);
        document.addEventListener('click', this._hide.bind(this));
        // document.addEventListener('contextmenu', this._hide.bind(this));
    }
    _hide() {
        this.style = {
            '--animate-duration': '0.2s'
        };
        this.subcomponents.menu.addClass('animate__fade', 'animate__animated', 'animate__faster');
        // const animateCB = () => {
        //     this.subcomponents.menu.removeClass(`animate__fade`, 'animate__animated', 'animate__faster');
        //     this.subcomponents.menu.off('animationend', animateCB);
        //     this.subcomponents.menu.hide();
        // }
        // setTimeout(animateCB, 200);
        // this.subcomponents.menu.on('animationend', animateCB);
        this.subcomponents.menu.hide();
        document.removeEventListener('click', this._hide.bind(this));
        document.removeEventListener('contextmenu', this._hide.bind(this));
    }
}
CBS.addElement('contextmenu', CBS_Contextmenu);
/**
 * Hides and shows content based on the selected tab
 * @date 8/25/2023
 *
 * @class CBS_TabNav
 * @typedef {CBS_TabNav}
 * @extends {CBS_Component}
 */
class CBS_TabNav extends CBS_Component {
    /**
     * The pages of the tab nav
     * @date 8/25/2023
     *
     * @public
     * @readonly
     */
    pages = {};
    /**
     * The container the pages are store in (must be put in separately)
     * @date 8/25/2023
     *
     * @public
     * @readonly
     * @type {CBS_Element}
     */
    container = new CBS_Element();
    /**
     * Creates an instance of CBS_TabNav
     * @date 8/25/2023
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super(options);
        this.el = document.createElement('ul');
        this.addClass('nav');
    }
    /**
     * Adds a page to the tab nav and returns it
     * @date 8/25/2023
     *
     * @param {string} name
     * @param {CBS_Node} content
     * @param {?CBS_ListItemOptions} [options]
     * @returns {*}
     */
    addPage(name, content, options) {
        if (this.pages[name])
            return console.error(`Page ${name} already exists`);
        const li = CBS.createElement('li', options);
        li.addClass('nav-item');
        const a = CBS.createElement('a');
        a.addClass('nav-link');
        a.setAttribute('href', '#');
        a.append(name);
        li.append(a);
        this.append(li);
        const page = new CBS_TabPage();
        page.append(content);
        this.container.append(page);
        this.pages[name] = page;
        if (Object.keys(this.pages).length === 1) {
            page.show();
            a.addClass('active');
        }
        else {
            page.hide();
        }
        li.on('click', () => {
            page.show();
            for (const key in this.pages) {
                if (key !== name)
                    this.pages[key].hide();
            }
            this.el.querySelector('.active')?.classList.remove('active');
            a.addClass('active');
        });
        return page;
    }
}
/**
 * The wrapper for the content of a tab
 * @date 8/25/2023
 *
 * @class CBS_TabPage
 * @typedef {CBS_TabPage}
 * @extends {CBS_Element}
 */
class CBS_TabPage extends CBS_Element {
    /**
     * Creates an instance of CBS_TabPage.
     * @date 8/25/2023
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super(options);
    }
}
CBS.addElement('tab-nav', CBS_TabNav);
class CBS_Alert extends CBS_Component {
    subcomponents = {
        text: new CBS_Span(),
        close: new CBS_Button({
            classes: ['btn-close'],
            attributes: {
                'data-bs-dismiss': 'alert',
                'aria-label': 'Close'
            }
        })
    };
    constructor(options) {
        super(options);
        this.addClass('alert', 'd-flex', 'align-items-center', 'alert-dismissible', 'fade', 'show');
        if (options?.color) {
            this.addClass('alert-' + options.color);
        }
        this.append(this.subcomponents.text, this.subcomponents.close);
    }
    set text(text) {
        this.subcomponents.text.content = text;
    }
}
;
CBS.addElement('alert', CBS_Alert);
// add template svg alerts
(() => {
    const alerts = {
        info: CBS_SVG.fromTemplate('info'),
        success: CBS_SVG.fromTemplate('success'),
        warning: CBS_SVG.fromTemplate('warning'),
        danger: CBS_SVG.fromTemplate('warning')
    };
    for (const [key, value] of Object.entries(alerts)) {
        const svg = new CBS_SVG();
        svg.addClass(`alert-${key}`);
        svg.append(value);
        CBS_SVG.addTemplate(key, svg);
    }
})();
class CBS_Toast extends CBS_Component {
    subcomponents = {
        container: new CBS_ToastContainer()
    };
    headerContent = [];
    bodyContent = [];
    constructor(options) {
        super(options);
        this.addClass('position-relative');
        this.setAttribute('aria-live', 'polite');
        this.setAttribute('aria-atomic', 'true');
        this.subcomponents
            .container
            .subcomponents
            .card
            .subcomponents
            .body.addClass(`bg-${options?.color || 'info'}`);
        this.append(this.subcomponents.container);
    }
    set header(content) {
        if (this.headerContent) {
            this.headerContent.forEach(node => {
                if (node instanceof HTMLElement) {
                    node.remove();
                }
                else if (node instanceof CBS_Element) {
                    node.destroy();
                }
                // and strings are automatically removed
            });
        }
        if (Array.isArray(content)) {
            this.headerContent = content;
            this.subcomponents.container.subcomponents.card.subcomponents.header.append(...content);
        }
        else {
            this.headerContent = [content];
            this.subcomponents.container.subcomponents.card.subcomponents.header.append(content);
        }
    }
    set body(content) {
        if (this.bodyContent) {
            this.bodyContent.forEach(node => {
                if (node instanceof HTMLElement) {
                    node.remove();
                }
                else if (node instanceof CBS_Element) {
                    node.destroy();
                }
                // and strings are automatically removed
            });
        }
        if (Array.isArray(content)) {
            this.subcomponents.container.subcomponents.card.subcomponents.body.append(...content);
        }
        else {
            this.subcomponents.container.subcomponents.card.subcomponents.body.append(content);
        }
    }
    show() {
        document.body.append(this.el);
        this.subcomponents
            .container
            .subcomponents
            .card
            .addClass('show');
    }
    hide() {
        this.subcomponents
            .container
            .subcomponents
            .card
            .addClass('hide');
    }
}
;
class CBS_ToastContainer extends CBS_Component {
    subcomponents = {
        card: new CBS_ToastCard()
    };
    constructor() {
        super();
        this.addClass('toast-container', 'position-absolute', 'p-3');
        this.append(this.subcomponents.card);
    }
}
;
class CBS_ToastCard extends CBS_Component {
    subcomponents = {
        header: new CBS_ToastHeader(),
        body: new CBS_ToastBody()
    };
    constructor() {
        super();
        this.addClass('toast');
        this.append(this.subcomponents.header, this.subcomponents.body);
    }
}
class CBS_ToastHeader extends CBS_Component {
    subcomponents = {
        close: new CBS_Button({
            classes: ['ml-2', 'mb-1'],
            attributes: {
                'data-dismiss': 'toast',
                'aria-label': 'Close'
            },
            style: {
                'outline': 'none'
            }
        })
    };
    constructor() {
        super();
        this.addClass('toast-header');
        this.append(this.subcomponents.close);
    }
}
class CBS_ToastBody extends CBS_Element {
    constructor() {
        super();
        this.addClass('toast-body');
    }
}
CBS.addElement('toast', CBS_Toast);
// add template svg toasts
(() => {
    const toasts = {
        info: {
            svg: CBS_SVG.fromTemplate('info'),
            textColor: 'dark'
        },
        success: {
            svg: CBS_SVG.fromTemplate('success'),
            textColor: 'light'
        },
        warning: {
            svg: CBS_SVG.fromTemplate('warning'),
            textColor: 'dark'
        },
        danger: {
            svg: CBS_SVG.fromTemplate('warning'),
            textColor: 'light'
        }
    };
    for (const [key, value] of Object.entries(toasts)) {
        const toast = new CBS_Toast();
        toast.addClass(`bg-${key}`, `text-${value.textColor}`, 'border-0');
        toast.subcomponents.container.subcomponents.card
            .subcomponents.header.append(value.svg);
        CBS_Toast.addTemplate(key, toast);
    }
})();
(() => {
    const card = new CBS_Card();
    card.subcomponents.image = new CBS_Image();
    card.subcomponents.header.prepend(card.subcomponents.image);
    CBS_Card.addTemplate('image', card);
})();
(() => {
    const form = new CBS_Form();
    const container = new CBS_Container({
        fluid: true
    });
    form.prepend(container);
})();
/**
 * Description placeholder
 *
 * @class CBS_Listener
 * @typedef {CBS_Listener}
 */
class CBS_Listener {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    event;
    /**
     * Description placeholder
     *
     * @type {CBS_ListenerCallback}
     */
    callback;
    // options?: AddEventListenerOptions;
    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    isAsync = true;
    /**
     * Creates an instance of CBS_Listener.
     *
     * @constructor
     * @param {string} event
     * @param {CBS_ListenerCallback} callback
     * @param {boolean} [isAsync=true]
     */
    constructor(event, callback, isAsync = true) {
        this.event = event;
        this.callback = callback;
        this.isAsync = isAsync;
    }
}
/**
 * Description placeholder
 *
 * @class CBS_MaterialIcon
 * @typedef {CBS_MaterialIcon}
 * @extends {CBS_Component}
 */
class CBS_MaterialIcon extends CBS_Component {
    /**
     * Creates an instance of CBS_MaterialIcon.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options) {
        super(options);
        this._el = document.createElement('i');
        this._el.classList.add('material-icons');
    }
    /**
     * Description placeholder
     *
     * @type {(string | number)}
     */
    set weight(weight) {
        this.settings = {
            ...this.settings,
            wght: weight,
        };
    } /**
     * Description placeholder
     */
    ;
    /**
     * Description placeholder
     *
     * @type {(string|number)}
     */
    get weight() {
        return this.settings?.['wght'] || 400;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set icon(icon) {
        this._el.innerHTML = icon;
    }
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get icon() {
        return this._el.innerHTML;
    }
    /**
     * Description placeholder
     *
     * @type {(string | number)}
     */
    set grade(grade) {
        this.settings = {
            ...this.settings,
            GRAD: grade,
        };
    } /**
     * Description placeholder
     */
    ;
    /**
     * Description placeholder
     *
     * @type {(string|number)}
     */
    get grade() {
        return this.settings?.['GRAD'] || 0;
    }
    /**
     * Description placeholder
     *
     * @type {(string | number)}
     */
    set opticalSize(opticalSize) {
        this.settings = {
            ...this.settings,
            opsz: opticalSize,
        };
    } /**
     * Description placeholder
     */
    ;
    /**
     * Description placeholder
     *
     * @type {(string|number)}
     */
    get opticalSize() {
        return this.settings?.['opsz'] || 0;
    }
    /**
     * Description placeholder
     *
     * @type {(string | number)}
     */
    set fill(fill) {
        this.settings = {
            ...this.settings,
            FILL: fill,
        };
    }
    /**
     * Description placeholder
     *
     * @type {(string|number)}
     */
    get fill() {
        return this.settings?.['FILL'] || 0;
    }
    /**
     * Description placeholder
     *
     * @private
     * @type {CBS_MaterialIconFontSettings}
     */
    get settings() {
        const { fontVariationSettings } = this._el.style;
        let output = {};
        if (fontVariationSettings) {
            const settings = fontVariationSettings.split(',');
            settings.forEach(setting => {
                const [key, value] = setting.split(' ');
                if (['wght', 'GRAD', 'FILL',].indexOf(key) >= 0)
                    output[key] = value;
            });
        }
        return output;
    }
    /**
     * Description placeholder
     *
     * @private
     * @type {CBS_MaterialIconFontSettings}
     */
    set settings(settings) {
        this._el.style.fontVariationSettings = Object.keys(settings).map(key => `${key} ${settings[key]}`).join(',');
    }
}
/**
 * Description placeholder
 *
 * @param {?string} [prefix]
 */
const CBS_GenerateMaterialIcons = (prefix) => {
    const icons = JSON.parse('["search","search","home","menu","close","settings","done","expand_more","check_circle","favorite","add","delete","arrow_back","star","chevron_right","logout","arrow_forward_ios","add_circle","cancel","arrow_back_ios","arrow_forward","arrow_drop_down","more_vert","check","check_box","toggle_on","grade","open_in_new","check_box_outline_blank","refresh","login","chevron_left","expand_less","radio_button_unchecked","more_horiz","apps","arrow_right_alt","radio_button_checked","download","remove","toggle_off","bolt","arrow_upward","filter_list","delete_forever","autorenew","key","arrow_downward","sort","sync","add_box","block","arrow_back_ios_new","restart_alt","menu_open","shopping_cart_checkout","expand_circle_down","backspace","arrow_circle_right","undo","done_all","arrow_right","do_not_disturb_on","open_in_full","double_arrow","manage_search","sync_alt","zoom_in","done_outline","drag_indicator","fullscreen","keyboard_double_arrow_right","star_half","settings_accessibility","ios_share","arrow_drop_up","reply","exit_to_app","unfold_more","library_add","cached","select_check_box","terminal","change_circle","disabled_by_default","swap_horiz","swap_vert","app_registration","download_for_offline","close_fullscreen","arrow_circle_left","arrow_circle_up","file_open","minimize","open_with","keyboard_double_arrow_left","dataset","add_task","keyboard_double_arrow_down","start","keyboard_voice","create_new_folder","forward","downloading","settings_applications","compare_arrows","redo","publish","zoom_out","arrow_left","html","token","switch_access_shortcut","arrow_circle_down","fullscreen_exit","sort_by_alpha","delete_sweep","indeterminate_check_box","first_page","keyboard_double_arrow_up","view_timeline","settings_backup_restore","arrow_drop_down_circle","assistant_navigation","sync_problem","clear_all","density_medium","heart_plus","filter_alt_off","expand","last_page","subdirectory_arrow_right","download_done","unfold_less","arrow_outward","123","swipe_left","auto_mode","saved_search","system_update_alt","place_item","maximize","javascript","output","search_off","swipe_up","fit_screen","select_all","dynamic_form","hide_source","swipe_right","switch_access_shortcut_add","browse_gallery","css","density_small","check_small","assistant_direction","file_download_done","move_up","youtube_searched_for","swap_horizontal_circle","data_thresholding","install_mobile","move_down","restore_from_trash","dataset_linked","abc","enable","install_desktop","keyboard_command_key","view_kanban","reply_all","browse_activity","switch_left","compress","swipe_down","swap_vertical_circle","remove_done","filter_list_off","apps_outage","switch_right","hide","swipe_vertical","more_up","star_rate","sync_disabled","pinch","keyboard_control_key","eject","key_off","php","subdirectory_arrow_left","view_cozy","do_not_disturb_off","transcribe","send_time_extension","width_normal","view_comfy_alt","heart_minus","share_reviews","width_full","unfold_more_double","view_compact_alt","file_download_off","extension_off","open_in_new_off","check_indeterminate_small","more_down","width_wide","repartition","swipe_left_alt","density_large","swipe_down_alt","swipe_right_alt","swipe_up_alt","unfold_less_double","keyboard_option_key","hls","hls_off","cycle","file_upload_off","rebase","rebase_edit","expand_content","empty_dashboard","magic_exchange","sync_saved_locally","quick_reference_all","acute","preliminary","quick_reference","clock_loader_60","data_alert","deployed_code","data_check","data_info_alert","new_window","step_into","point_scan","search_check","magnification_small","magnification_large","captive_portal","clock_loader_40","star_rate_half","clock_loader_90","drag_pan","clock_loader_10","left_click","patient_list","unknown_med","move_group","arrow_insert","capture","clock_loader_20","left_panel_close","question_exchange","chip_extraction","iframe","chronic","input_circle","bottom_right_click","clock_loader_80","go_to_line","left_panel_open","right_panel_close","shelf_position","right_click","step","error_med","resize","step_out","all_match","bottom_panel_open","drag_click","step_over","app_badging","output_circle","right_panel_open","shelf_auto_hide","amend","page_info","pip","arrow_range","arrow_top_right","event_list","jump_to_element","move_selection_up","rule_settings","arrow_top_left","arrows_outward","back_to_tab","bottom_panel_close","bubbles","iframe_off","move_selection_down","move_selection_right","open_in_new_down","position_bottom_left","position_bottom_right","position_top_right","reopen_window","share_windows","stack","switch_access","heart_check","move_selection_left","pip_exit","stack_off","stack_star","person","person","group","share","thumb_up","groups","person_add","public","handshake","support_agent","face","sentiment_satisfied","rocket_launch","group_add","workspace_premium","psychology","diversity_3","emoji_objects","water_drop","eco","pets","travel_explore","mood","sunny","quiz","health_and_safety","sentiment_dissatisfied","sentiment_very_satisfied","military_tech","thumb_down","gavel","recycling","diamond","monitor_heart","emoji_people","diversity_1","workspaces","vaccines","compost","forest","recommend","waving_hand","person_remove","wc","medication","group_work","sentiment_very_dissatisfied","sentiment_neutral","diversity_2","front_hand","cruelty_free","man","medical_information","psychology_alt","coronavirus","add_reaction","rocket","female","potted_plant","emoji_nature","rainy","person_off","woman","connect_without_contact","cookie","male","mood_bad","bedtime","solar_power","thunderstorm","communication","groups_2","partly_cloudy_day","cloudy","thumbs_up_down","emoji_flags","masks","hive","heart_broken","sentiment_extremely_dissatisfied","clear_day","boy","whatshot","cloudy_snowing","emoji_food_beverage","emoji_transportation","wind_power","elderly","face_6","reduce_capacity","sick","pregnant_woman","face_3","bloodtype","group_remove","medication_liquid","egg","groups_3","clear_night","co2","weight","follow_the_signs","skull","face_4","oil_barrel","transgender","elderly_woman","clean_hands","sanitizer","person_2","bring_your_own_ip","public_off","face_2","social_distance","routine","sign_language","south_america","sunny_snowing","emoji_symbols","garden_cart","flood","egg_alt","face_5","cyclone","girl","person_4","dentistry","tsunami","group_off","outdoor_garden","partly_cloudy_night","severe_cold","snowing","person_3","tornado","vaping_rooms","landslide","foggy","safety_divider","woman_2","no_adult_content","volcano","man_2","blind","18_up_rating","6_ft_apart","vape_free","not_accessible","man_4","radiology","rib_cage","hand_bones","bedtime_off","rheumatology","man_3","orthopedics","tibia","skeleton","humerus","agender","femur","foot_bones","tibia_alt","femur_alt","humerus_alt","ulna_radius","ulna_radius_alt","diversity_4","specific_gravity","partner_exchange","breastfeeding","cognition","eyeglasses","psychiatry","footprint","labs","social_leaderboard","neurology","vital_signs","nutrition","demography","globe_asia","clinical_notes","stethoscope","sentiment_excited","altitude","lab_research","home_health","recent_patient","dew_point","conditions","globe_uk","taunt","wrist","helicopter","prayer_times","sentiment_stressed","share_off","metabolism","sentiment_content","sentiment_sad","cardiology","sentiment_frustrated","stethoscope_check","body_system","glucose","infrared","weather_hail","barefoot","microbiology","sentiment_calm","stethoscope_arrow","cookie_off","earthquake","ent","oncology","short_stay","water_lux","water_voc","allergies","cheer","deceased","endocrinology","explosion","genetics","gynecology","hematology","mixture_med","ophthalmology","oxygen_saturation","prescriptions","pulmonology","ward","allergy","body_fat","congenital","dermatology","emoticon","humidity_percentage","immunology","inpatient","lab_panel","medical_mask","moving_beds","nephrology","oral_disease","outpatient","outpatient_med","pediatrics","salinity","sentiment_worried","surgical","symptoms","syringe","urology","water_do","water_orp","water_ph","weather_mix","wounds_injuries","admin_meds","fluid","fluid_balance","fluid_med","gastroenterology","pill","pill_off","respiratory_rate","total_dissolved_solids","water_bottle","falling","mist","procedure","rainy_heavy","rainy_light","rainy_snow","snowing_heavy","water_bottle_large","water_ec","account_circle","account_circle","info","visibility","calendar_month","schedule","help","language","warning","lock","error","visibility_off","verified","manage_accounts","task_alt","history","event","bookmark","calendar_today","tips_and_updates","question_mark","lightbulb","fingerprint","category","update","lock_open","priority_high","code","build","date_range","upload_file","supervisor_account","event_available","ads_click","today","settings_suggest","touch_app","preview","pending","stars","new_releases","account_box","celebration","how_to_reg","translate","bug_report","push_pin","alarm","edit_calendar","edit_square","label","event_note","extension","rate_review","record_voice_over","web","hourglass_empty","published_with_changes","support","notification_important","help_center","upload","accessibility_new","bookmarks","pan_tool_alt","supervised_user_circle","collections_bookmark","dangerous","interests","all_inclusive","rule","change_history","priority","event_upcoming","build_circle","wysiwyg","pan_tool","api","circle_notifications","hotel_class","manage_history","accessible","web_asset","upgrade","lock_reset","bookmark_add","input","event_busy","flutter_dash","more_time","save_as","backup","model_training","accessibility","alarm_on","dynamic_feed","pageview","home_app_logo","perm_contact_calendar","label_important","history_toggle_off","square_foot","approval","more","swipe","assistant","component_exchange","event_repeat","bookmark_added","app_shortcut","unpublished","open_in_browser","offline_bolt","notification_add","no_accounts","free_cancellation","background_replace","running_with_errors","anchor","webhook","hourglass_full","3d_rotation","lock_person","new_label","lock_clock","accessible_forward","auto_delete","add_alert","domain_verification","smart_button","outbound","hand_gesture","settings_power","tab","chrome_reader_mode","online_prediction","gesture","edit_notifications","generating_tokens","lightbulb_circle","find_replace","backup_table","offline_pin","wifi_protected_setup","ad_units","http","bookmark_remove","alarm_add","pinch_zoom_out","on_device_training","snooze","code_off","batch_prediction","pinch_zoom_in","commit","hourglass_disabled","settings_overscan","polymer","logo_dev","youtube_activity","time_auto","person_add_disabled","voice_over_off","alarm_off","update_disabled","timer_10_alt_1","rounded_corner","label_off","all_out","timer_3_alt_1","tab_unselected","rsvp","web_asset_off","pin_invoke","pin_end","code_blocks","approval_delegation","arrow_selector_tool","problem","visibility_lock","award_star","auto_label","settings_account_box","draft_orders","release_alert","pan_zoom","account_circle_off","alarm_smart_wake","bookmark_manager","help_clinic","shift","watch_screentime","preview_off","lock_open_right","measuring_tape","shift_lock","domain_verification_off","gesture_select","warning_off","water_lock","ad_off","supervised_user_circle_off","mail","mail","call","notifications","send","chat","link","forum","inventory_2","phone_in_talk","contact_support","chat_bubble","notifications_active","alternate_email","sms","comment","power_settings_new","hub","person_search","import_contacts","contact_mail","contacts","live_help","forward_to_inbox","mark_email_unread","lan","reviews","contact_phone","mode_comment","hourglass_top","inbox","outgoing_mail","drafts","hourglass_bottom","mark_email_read","sms_failed","link_off","calendar_add_on","phone_enabled","add_comment","speaker_notes","perm_phone_msg","co_present","topic","call_end","notifications_off","cell_tower","mark_chat_unread","schedule_send","dialpad","call_made","satellite_alt","mark_unread_chat_alt","unarchive","3p","cancel_presentation","mark_as_unread","move_to_inbox","attach_email","phonelink_ring","next_plan","unsubscribe","phone_callback","call_received","settings_phone","call_split","present_to_all","add_call","markunread_mailbox","all_inbox","phone_forwarded","voice_chat","mail_lock","attribution","voicemail","duo","contact_emergency","mark_chat_read","upcoming","phone_disabled","outbox","swap_calls","phonelink_lock","spoke","cancel_schedule_send","notifications_paused","ring_volume","picture_in_picture_alt","quickreply","phone_missed","comment_bank","send_and_archive","chat_add_on","settings_bluetooth","phonelink_erase","picture_in_picture","comments_disabled","video_chat","score","pause_presentation","cell_wifi","speaker_phone","speaker_notes_off","auto_read_play","mms","call_merge","play_for_work","call_missed_outgoing","wifi_channel","call_missed","calendar_apps_script","phone_paused","rtt","auto_read_pause","phone_locked","wifi_calling","dialer_sip","nat","chat_apps_script","sip","phone_bluetooth_speaker","e911_avatar","inbox_customize","chat_error","chat_paste_go","phonelink_ring_off","network_manage","signal_cellular_add","wifi_proxy","call_log","call_quality","wifi_add","edit","edit","photo_camera","filter_alt","image","navigate_next","tune","timer","picture_as_pdf","circle","palette","auto_awesome","add_a_photo","magic_button","photo_library","navigate_before","auto_stories","add_photo_alternate","brush","imagesmode","nature","flash_on","wb_sunny","camera","straighten","looks_one","landscape","timelapse","slideshow","grid_on","rotate_right","crop_square","adjust","style","crop_free","aspect_ratio","brightness_6","photo","nature_people","filter_vintage","crop","image_search","movie_filter","blur_on","center_focus_strong","contrast","face_retouching_natural","compare","looks_two","rotate_left","colorize","flare","filter_none","wb_incandescent","filter_drama","healing","looks_3","wb_twilight","brightness_5","invert_colors","lens","animation","opacity","incomplete_circle","broken_image","filter_center_focus","add_to_photos","brightness_4","flip","flash_off","center_focus_weak","auto_awesome_motion","mic_external_on","flip_camera_android","lens_blur","details","grain","no_photography","panorama","image_not_supported","web_stories","dehaze","gif_box","flaky","loupe","exposure_plus_1","settings_brightness","texture","auto_awesome_mosaic","looks_4","filter_1","timer_off","flip_camera_ios","camera_enhance","panorama_fish_eye","filter","view_compact","brightness_1","photo_camera_front","control_point_duplicate","photo_album","brightness_7","transform","linked_camera","view_comfy","crop_16_9","looks","hide_image","looks_5","exposure","photo_filter","rotate_90_degrees_ccw","filter_hdr","brightness_3","gif","leak_add","hdr_strong","crop_7_5","gradient","vrpano","camera_roll","hdr_auto","crop_portrait","blur_circular","motion_photos_auto","rotate_90_degrees_cw","brightness_2","photo_size_select_small","shutter_speed","looks_6","camera_front","flash_auto","filter_2","crop_landscape","filter_tilt_shift","deblur","monochrome_photos","astrophotography_auto","crop_5_4","hdr_weak","night_sight_auto","filter_4","filter_3","motion_photos_paused","crop_rotate","crop_3_2","tonality","switch_camera","photo_frame","exposure_zero","photo_size_select_large","macro_off","filter_frames","ev_shadow","fluorescent","party_mode","raw_on","motion_blur","exposure_plus_2","photo_camera_back","blur_linear","exposure_neg_1","wb_iridescent","filter_b_and_w","panorama_horizontal","switch_video","motion_photos_off","filter_5","blur_medium","invert_colors_off","face_retouching_off","filter_7","burst_mode","panorama_photosphere","hdr_on","grid_off","filter_9_plus","filter_8","auto_fix","blur_short","filter_9","timer_10","dirty_lens","wb_shade","no_flash","filter_6","trail_length","image_aspect_ratio","exposure_neg_2","vignette","timer_3","leak_remove","60fps_select","blur_off","30fps_select","perm_camera_mic","mic_external_off","trail_length_medium","camera_rear","panorama_vertical","trail_length_short","auto_fix_high","autofps_select","night_sight_auto_off","panorama_wide_angle","mp","hdr_off","hdr_on_select","24mp","hdr_enhanced_select","22mp","astrophotography_off","auto_fix_normal","10mp","12mp","18mp","wb_auto","hdr_auto_select","raw_off","9mp","hdr_plus","13mp","20mp","7mp","15mp","hdr_off_select","5mp","hevc","16mp","19mp","14mp","23mp","2mp","8mp","3mp","6mp","11mp","21mp","17mp","4mp","auto_fix_off","gallery_thumbnail","settings_photo_camera","settings_panorama","motion_mode","settings_motion_mode","settings_night_sight","background_dot_large","settings_video_camera","50mp","background_grid_small","low_density","macro_auto","settings_b_roll","settings_cinematic_blur","settings_slow_motion","settings_timelapse","high_density","shopping_cart","shopping_cart","payments","shopping_bag","monitoring","credit_card","receipt_long","attach_money","storefront","sell","trending_up","database","account_balance","work","paid","account_balance_wallet","analytics","insights","query_stats","store","savings","monetization_on","calculate","qr_code_scanner","bar_chart","add_shopping_cart","account_tree","receipt","redeem","currency_exchange","trending_flat","shopping_basket","qr_code_2","domain","qr_code","precision_manufacturing","leaderboard","corporate_fare","timeline","currency_rupee","insert_chart","wallet","show_chart","euro","work_history","meeting_room","credit_score","barcode_scanner","pie_chart","loyalty","copyright","barcode","conversion_path","track_changes","auto_graph","trending_down","price_check","euro_symbol","schema","add_business","add_card","card_membership","currency_bitcoin","price_change","production_quantity_limits","donut_large","tenancy","data_exploration","bubble_chart","donut_small","contactless","money","stacked_line_chart","stacked_bar_chart","toll","money_off","cases","currency_yen","currency_pound","area_chart","atr","remove_shopping_cart","room_preferences","add_chart","shop","domain_add","card_travel","grouped_bar_chart","legend_toggle","scatter_plot","credit_card_off","ssid_chart","mediation","candlestick_chart","currency_ruble","waterfall_chart","full_stacked_bar_chart","domain_disabled","strikethrough_s","shop_two","next_week","atm","multiline_chart","currency_lira","currency_yuan","no_meeting_room","currency_franc","autopay","contactless_off","family_history","podium","chart_data","order_approve","flowsheet","conveyor_belt","bar_chart_4_bars","auto_meeting_room","forklift","front_loader","pallet","inactive_order","qr_code_2_add","barcode_reader","conversion_path_off","trolley","order_play","pin_drop","pin_drop","location_on","map","home_pin","explore","restaurant","flag","my_location","local_fire_department","person_pin_circle","local_mall","near_me","where_to_vote","business_center","east","restaurant_menu","handyman","factory","local_library","home_work","medical_services","layers","local_activity","share_location","emergency","north_east","add_location","fastfood","warehouse","navigation","person_pin","local_parking","home_repair_service","local_hospital","south","local_police","zoom_out_map","location_searching","local_florist","location_away","crisis_alert","west","local_gas_station","park","maps_ugc","cleaning_services","local_atm","package","360","electrical_services","north","flag_circle","add_location_alt","directions","fmd_bad","theater_comedy","local_drink","location_home","local_pizza","local_post_office","not_listed_location","wine_bar","beenhere","local_convenience_store","signpost","alt_route","location_automation","tour","church","trip_origin","traffic","local_laundry_service","safety_check","ev_station","takeout_dining","moving","zoom_in_map","soup_kitchen","stadium","transfer_within_a_station","location_off","pest_control","connecting_airports","multiple_stop","wrong_location","edit_location","plumbing","mode_of_travel","minor_crash","south_east","local_pharmacy","add_road","fire_truck","castle","dry_cleaning","set_meal","baby_changing_station","layers_clear","edit_location_alt","mosque","north_west","local_car_wash","edit_attributes","run_circle","transit_enterexit","sos","satellite","edit_road","south_west","add_home","streetview","kebab_dining","airline_stops","fire_hydrant","local_see","assist_walker","add_home_work","flight_class","no_meals","remove_road","synagogue","fort","temple_buddhist","location_disabled","compass_calibration","temple_hindu","explore_off","pest_control_rodent","near_me_disabled","directions_alt","pergola","directions_off","directions_alt_off","move_location","moving_ministry","move","description","description","content_copy","dashboard","edit_note","menu_book","grid_view","list","folder","list_alt","inventory","folder_open","article","fact_check","attach_file","format_list_bulleted","assignment","task","checklist","cloud_upload","draft","summarize","feed","draw","cloud","newspaper","file_copy","view_list","note_add","border_color","book","history_edu","design_services","pending_actions","format_quote","post_add","request_quote","cloud_download","drag_handle","contact_page","table","space_dashboard","archive","content_paste","percent","attachment","assignment_ind","format_list_numbered","assignment_turned_in","tag","table_chart","sticky_note_2","dashboard_customize","text_fields","reorder","format_bold","integration_instructions","find_in_page","note","text_snippet","document_scanner","checklist_rtl","note_alt","cloud_sync","edit_document","table_rows","perm_media","cloud_done","title","table_view","content_cut","data_object","cut","notes","subject","functions","format_italic","content_paste_search","format_color_fill","folder_shared","plagiarism","horizontal_rule","file_present","folder_copy","format_align_left","ballot","team_dashboard","format_paint","add_link","cloud_off","read_more","view_column","difference","view_agenda","format_size","format_underlined","vertical_align_top","toc","height","vertical_align_bottom","copy_all","drive_folder_upload","view_week","format_color_text","assignment_late","view_module","drive_file_move","low_priority","assignment_return","format_align_center","folder_special","segment","calendar_view_month","polyline","folder_zip","square","breaking_news_alt_1","format_align_right","grading","view_headline","linear_scale","view_quilt","edit_off","view_carousel","text_increase","request_page","view_sidebar","pages","text_format","format_align_justify","calendar_view_week","hexagon","numbers","docs_add_on","folder_delete","format_shapes","forms_add_on","imagesearch_roller","join_full","calendar_view_day","video_file","cloud_queue","format_list_numbered_rtl","font_download","join_inner","add_to_drive","content_paste_go","restore_page","rectangle","vertical_split","format_color_reset","rule_folder","view_stream","cloud_circle","format_indent_increase","spellcheck","assignment_returned","data_array","align_horizontal_left","pivot_table_chart","text_decrease","deselect","vertical_align_center","pentagon","merge_type","space_bar","view_day","format_strikethrough","flip_to_front","join_left","border_all","short_text","shape_line","format_line_spacing","line_weight","horizontal_split","format_indent_decrease","align_horizontal_center","join_right","snippet_folder","subtitles_off","align_vertical_bottom","folder_off","align_horizontal_right","glyphs","format_clear","insert_page_break","content_paste_off","vertical_distribute","function","superscript","horizontal_distribute","line_axis","line_style","flip_to_back","align_vertical_center","align_vertical_top","margin","clarify","wrap_text","view_array","subscript","border_clear","border_style","border_outer","amp_stories","type_specimen","text_rotate_vertical","padding","forms_apps_script","border_vertical","text_rotation_none","format_textdirection_l_to_r","format_overline","docs_apps_script","border_horizontal","font_download_off","format_textdirection_r_to_l","text_rotation_angleup","border_bottom","border_top","text_rotation_down","border_left","text_rotation_angledown","border_inner","text_rotate_up","border_right","format_h1","assignment_add","finance_chip","view_column_2","join","format_underlined_squiggle","counter_1","format_paragraph","format_h2","format_image_left","overview","slide_library","format_list_bulleted_add","format_h3","format_image_right","format_h5","frame_inspect","variables","format_h6","format_h4","process_chart","voting_chip","location_chip","counter_2","lab_profile","format_ink_highlighter","signature","counter_3","equal","business_chip","export_notes","shapes","add_notes","cell_merge","counter_4","text_select_move_forward_character","frame_source","diagnosis","list_alt_add","table_rows_narrow","unknown_document","decimal_increase","insert_text","line_end_arrow_notch","regular_expression","reset_image","line_start","stylus_laser_pointer","table_chart_view","format_letter_spacing","line_end","grid_guides","line_end_square","match_case","scan_delete","ungroup","scan","source_notes","align_justify_space_between","counter_5","counter_6","language_chinese_quick","line_end_arrow","other_admission","stroke_full","align_justify_space_around","draw_collage","folder_managed","folder_supervised","line_end_circle","line_end_diamond","line_start_circle","sheets_rtl","smb_share","tab_close","tab_move","text_select_jump_to_beginning","top_panel_open","width","align_justify_space_even","align_space_between","draw_abstract","frame_reload","line_start_square","match_word","select","tab_new_right","text_select_move_forward_word","text_select_start","thumbnail_bar","top_panel_close","align_justify_center","align_justify_flex_end","align_justify_flex_start","align_space_around","align_space_even","attach_file_add","counter_7","counter_8","fit_page","fit_width","format_text_overflow","format_text_wrap","heap_snapshot_thumbnail","highlighter_size_4","language_chinese_dayi","language_chinese_pinyin","language_chinese_wubi","language_gb_english","language_korean_latin","language_us","line_curve","pen_size_2","pen_size_5","stroke_partial","tab_close_right","tab_duplicate","text_select_move_down","text_select_move_up","align_center","align_end","align_flex_center","align_flex_end","align_flex_start","align_items_stretch","align_justify_stretch","align_self_stretch","align_start","align_stretch","counter_0","counter_9","decimal_decrease","flex_direction","flex_no_wrap","flex_wrap","format_letter_spacing_2","format_letter_spacing_standard","format_letter_spacing_wide","format_letter_spacing_wider","format_text_clip","heap_snapshot_large","heap_snapshot_multiple","highlighter_size_1","highlighter_size_2","highlighter_size_3","highlighter_size_5","language_chinese_array","language_chinese_cangjie","language_french","language_international","language_pinyin","language_us_colemak","language_us_dvorak","letter_switch","line_start_arrow","line_start_arrow_notch","line_start_diamond","pen_size_1","pen_size_3","pen_size_4","special_character","tab_group","tab_recent","text_select_end","text_select_jump_to_end","text_select_move_back_character","text_select_move_back_word","play_arrow","play_arrow","play_circle","mic","videocam","volume_up","pause","music_note","library_books","movie","skip_next","speed","replay","volume_off","view_in_ar","pause_circle","fiber_manual_record","skip_previous","stop_circle","stop","equalizer","subscriptions","video_library","fast_forward","playlist_add","video_call","repeat","volume_mute","shuffle","mic_off","library_music","hearing","podcasts","playlist_add_check","fast_rewind","sound_detection_dog_barking","queue_music","video_camera_front","subtitles","volume_down","play_pause","album","radio","av_timer","discover_tune","library_add_check","videocam_off","closed_caption","stream","forward_10","not_started","playlist_play","replay_10","fiber_new","branding_watermark","recent_actors","text_to_speech","playlist_remove","interpreter_mode","slow_motion_video","frame_person","playlist_add_check_circle","settings_voice","video_settings","featured_play_list","audio_file","sound_detection_loud_sound","lyrics","play_lesson","hd","repeat_one","call_to_action","add_to_queue","high_quality","music_off","video_camera_back","spatial_audio_off","shuffle_on","playlist_add_circle","volume_down_alt","hearing_disabled","featured_video","replay_5","repeat_on","queue_play_next","spatial_audio","art_track","explicit","airplay","speech_to_text","forward_30","forward_5","4k","music_video","replay_30","spatial_tracking","control_camera","closed_caption_disabled","digital_out_of_home","video_label","fiber_smart_record","play_disabled","repeat_one_on","broadcast_on_personal","sd","missed_video_call","surround_sound","10k","fiber_pin","60fps","sound_detection_glass_break","remove_from_queue","broadcast_on_home","fiber_dvr","30fps","4k_plus","video_stable","8k","1k","privacy","8k_plus","2k","7k","1k_plus","9k","9k_plus","5k","2k_plus","5k_plus","6k","6k_plus","3k","7k_plus","3k_plus","auto_detect_voice","cinematic_blur","media_link","video_camera_front_off","autoplay","forward_media","movie_edit","auto_videocam","resume","select_to_speak","autopause","forward_circle","autostop","sound_sampler","frame_person_off","view_in_ar_off","local_shipping","local_shipping","directions_car","flight","directions_run","directions_walk","flight_takeoff","directions_bus","directions_bike","train","airport_shuttle","pedal_bike","directions_boat","two_wheeler","agriculture","local_taxi","sailing","electric_car","flight_land","hail","no_crash","commute","motorcycle","car_crash","tram","departure_board","subway","electric_moped","turn_right","electric_scooter","fork_right","directions_subway","tire_repair","electric_bike","rv_hookup","bus_alert","turn_left","transportation","airlines","taxi_alert","u_turn_left","directions_railway","electric_rickshaw","turn_slight_right","u_turn_right","fork_left","railway_alert","bike_scooter","turn_sharp_right","turn_slight_left","no_transfer","snowmobile","turn_sharp_left","ambulance","school","school","campaign","construction","engineering","volunteer_activism","science","sports_esports","confirmation_number","real_estate_agent","cake","self_improvement","sports_soccer","air","biotech","water","hiking","architecture","sports_score","personal_injury","sports_basketball","waves","theaters","sports_tennis","switch_account","nights_stay","sports_gymnastics","backpack","sports_motorsports","how_to_vote","sports_kabaddi","surfing","piano","sports","toys","sports_volleyball","sports_martial_arts","sports_baseball","camping","downhill_skiing","swords","scoreboard","kayaking","phishing","sports_handball","sports_football","skateboarding","sports_golf","sports_cricket","toys_fan","nordic_walking","roller_skating","kitesurfing","rowing","scuba_diving","storm","sports_mma","paragliding","snowboarding","sports_hockey","ice_skating","snowshoeing","sports_rugby","sledding","piano_off","no_backpack","cake_add","sprint","health_metrics","mindfulness","sleep","stress_management","exercise","steps","relax","ecg_heart","readiness_score","avg_time","distance","menstrual_health","laps","onsen","podiatry","floor","azm","bath_outdoor","bia","fertile","avg_pace","eda","pace","person_play","person_celebrate","water_medium","interactive_space","spo2","water_full","elevation","sauna","bath_private","glass_cup","hr_resting","monitor_weight_gain","sleep_score","water_loss","bath_public_large","check_in_out","thermometer_loss","monitor_weight_loss","physical_therapy","play_shapes","thermometer_gain","phone_iphone","phone_iphone","save","smartphone","print","keyboard_arrow_down","computer","devices","desktop_windows","smart_display","dns","keyboard_backspace","headphones","smart_toy","phone_android","keyboard_arrow_right","memory","live_tv","keyboard","laptop_mac","headset_mic","keyboard_arrow_up","tv","device_thermostat","mouse","balance","route","point_of_sale","keyboard_arrow_left","laptop_chromebook","keyboard_return","power","watch","laptop_windows","router","developer_board","display_settings","scale","book_online","fax","developer_mode","cast","cast_for_education","videogame_asset","device_hub","straight","screen_search_desktop","desktop_mac","settings_ethernet","settings_input_antenna","mobile_friendly","monitor","important_devices","tablet_mac","devices_other","send_to_mobile","system_update","settings_remote","monitor_weight","screen_rotation","screen_share","keyboard_alt","settings_input_component","speaker","sim_card","merge","keyboard_tab","vibration","power_off","connected_tv","screenshot_monitor","remember_me","tablet","browser_updated","security_update_good","sd_card","cast_connected","device_unknown","tablet_android","charging_station","phonelink_setup","punch_clock","scanner","screenshot","settings_input_hdmi","stay_current_portrait","tap_and_play","keyboard_hide","print_disabled","security_update_warning","disc_full","app_blocking","keyboard_capslock","speaker_group","mobile_screen_share","aod","sd_card_alert","tty","lift_to_talk","add_to_home_screen","earbuds","perm_device_information","stop_screen_share","mobile_off","headset_off","desktop_access_disabled","reset_tv","offline_share","adf_scanner","headphones_battery","screen_lock_portrait","roundabout_right","dock","settop_component","settings_input_svideo","watch_off","smart_screen","stay_current_landscape","chromecast_device","settings_cell","earbuds_battery","home_max","power_input","no_sim","screen_lock_landscape","ramp_right","developer_board_off","roundabout_left","stay_primary_portrait","stay_primary_landscape","tv_off","home_mini","phonelink_off","ramp_left","screen_lock_rotation","videogame_asset_off","aod_tablet","gamepad","robot","devices_wearables","ambient_screen","rear_camera","aod_watch","ecg","hard_drive","night_sight_max","devices_off","pacemaker","screenshot_tablet","touchpad_mouse","memory_alt","stream_apps","watch_wake","camera_video","deskphone","hard_drive_2","lda","print_add","print_connect","print_error","print_lock","ventilator","watch_button_press","dark_mode","dark_mode","light_mode","wifi","signal_cellular_alt","password","widgets","pin","storage","rss_feed","battery_full","android","wifi_off","bluetooth","battery_charging_full","dvr","thermostat","graphic_eq","nightlight","battery_5_bar","signal_wifi_4_bar","gpp_maybe","cable","gpp_bad","data_usage","battery_4_bar","battery_full_alt","signal_cellular_4_bar","airplanemode_active","radar","battery_0_bar","cameraswitch","wallpaper","signal_disconnected","flashlight_on","network_check","battery_6_bar","charger","wifi_tethering","sim_card_download","usb","quick_phrases","splitscreen","battery_3_bar","battery_1_bar","adb","network_wifi_3_bar","battery_low","battery_alert","bluetooth_searching","network_wifi","bluetooth_connected","wifi_find","5g","battery_2_bar","brightness_high","network_cell","nfc","pattern","data_saver_on","bluetooth_disabled","signal_wifi_statusbar_not_connected","signal_wifi_bad","signal_cellular_3_bar","noise_control_off","network_wifi_2_bar","network_wifi_1_bar","signal_wifi_off","brightness_medium","mode_standby","brightness_low","battery_very_low","mobiledata_off","signal_wifi_0_bar","grid_4x4","battery_charging_20","battery_charging_80","battery_saver","battery_charging_90","flashlight_off","signal_wifi_statusbar_null","settings_system_daydream","battery_charging_50","battery_unknown","signal_cellular_2_bar","screen_rotation_alt","wifi_calling_3","badge_critical_battery","4g_mobiledata","signal_cellular_1_bar","noise_aware","battery_charging_60","nearby_error","wifi_lock","do_not_disturb_on_total_silence","signal_cellular_connected_no_internet_0_bar","battery_20","battery_charging_30","signal_cellular_0_bar","network_ping","brightness_auto","wifi_tethering_error","edgesensor_high","wifi_calling_1","signal_cellular_connected_no_internet_4_bar","wifi_2_bar","battery_30","battery_50","airplanemode_inactive","grid_3x3","lte_mobiledata","perm_data_setting","1x_mobiledata","signal_cellular_alt_2_bar","battery_60","bluetooth_drive","signal_cellular_nodata","perm_scan_wifi","devices_fold","battery_90","wifi_calling_2","4g_plus_mobiledata","media_bluetooth_on","network_locked","signal_cellular_off","battery_80","timer_10_select","wifi_tethering_off","signal_cellular_alt_1_bar","edgesensor_low","usb_off","wifi_1_bar","3g_mobiledata","apk_install","signal_cellular_null","lte_plus_mobiledata","grid_goldenratio","g_mobiledata","portable_wifi_off","noise_control_on","media_bluetooth_off","timer_3_select","e_mobiledata","apk_document","nearby_off","h_mobiledata","r_mobiledata","h_plus_mobiledata","dual_screen","screenshot_region","overview_key","battery_status_good","dock_to_left","dock_to_right","magic_tether","magnify_fullscreen","keyboard_external_input","keyboard_off","magnify_docked","1x_mobiledata_badge","5g_mobiledata_badge","backlight_low","battery_plus","brightness_empty","display_external_input","dock_to_bottom","keyboard_capslock_badge","keyboard_full","keyboard_keys","lte_mobiledata_badge","screen_record","screenshot_keyboard","3g_mobiledata_badge","4g_mobiledata_badge","backlight_high","battery_change","battery_error","battery_share","e_mobiledata_badge","ev_mobiledata_badge","g_mobiledata_badge","grid_3x3_off","h_mobiledata_badge","h_plus_mobiledata_badge","keyboard_onscreen","keyboard_previous_language","lte_plus_mobiledata_badge","screen_rotation_up","screenshot_frame","splitscreen_bottom","splitscreen_left","splitscreen_right","splitscreen_top","wallpaper_slideshow","wifi_home","wifi_notification","badge","badge","verified_user","admin_panel_settings","report","security","vpn_key","shield","policy","exclamation","privacy_tip","assured_workload","vpn_lock","disabled_visible","e911_emergency","enhanced_encryption","private_connectivity","vpn_key_off","add_moderator","no_encryption","sync_lock","wifi_password","key_visualizer","remove_moderator","report_off","shield_lock","shield_person","vpn_key_alert","apartment","apartment","location_city","fitness_center","lunch_dining","spa","cottage","local_cafe","hotel","family_restroom","beach_access","local_bar","pool","other_houses","luggage","liquor","airplane_ticket","casino","sports_bar","bakery_dining","ramen_dining","nightlife","local_dining","holiday_village","icecream","escalator_warning","dinner_dining","museum","food_bank","night_shelter","festival","attractions","golf_course","stairs","villa","smoke_free","smoking_rooms","car_rental","airline_seat_recline_normal","elevator","gite","child_friendly","airline_seat_recline_extra","breakfast_dining","carpenter","car_repair","cabin","brunch_dining","no_food","houseboat","do_not_touch","rice_bowl","tapas","wheelchair_pickup","bento","no_drinks","do_not_step","airline_seat_flat","bungalow","airline_seat_individual_suite","escalator","chalet","no_luggage","airline_seat_legroom_extra","airline_seat_flat_angled","airline_seat_legroom_normal","airline_seat_legroom_reduced","no_stroller","house","house","bed","ac_unit","chair","coffee","electric_bolt","child_care","sensors","back_hand","checkroom","emergency_home","grass","shower","mode_fan","mop","kitchen","room_service","thermometer","styler","yard","bathtub","king_bed","roofing","energy_savings_leaf","window","cooking","valve","garage_home","door_front","mode_heat","light","foundation","outdoor_grill","garage","dining","table_restaurant","deck","sensor_occupied","weekend","coffee_maker","flatware","humidity_high","fireplace","highlight","mode_night","humidity_low","electric_meter","tv_gen","humidity_mid","bedroom_parent","chair_alt","blender","microwave","scene","single_bed","heat_pump","oven_gen","bedroom_baby","bathroom","in_home_mode","hot_tub","mode_off_on","hardware","sprinkler","table_bar","gas_meter","crib","soap","countertops","living","mode_cool","home_iot_device","fire_extinguisher","propane_tank","outlet","remote_gen","sensor_door","gate","airware","event_seat","matter","faucet","dishwasher_gen","balcony","energy_program_saving","air_freshener","wash","camera_indoor","water_damage","bedroom_child","house_siding","microwave_gen","switch","detector_smoke","door_sliding","iron","energy_program_time_used","desk","water_heater","umbrella","dresser","door_back","doorbell","fence","mode_fan_off","hvac","camera_outdoor","kettle","emergency_heat","air_purifier_gen","emergency_share","stroller","google_wifi","curtains","multicooker","shield_moon","sensors_off","mode_heat_cool","thermostat_auto","emergency_recording","smart_outlet","blinds","controller_gen","roller_shades","dry","blinds_closed","roller_shades_closed","propane","sensor_window","thermostat_carbon","range_hood","doorbell_3p","blanket","tv_with_assistant","vertical_shades_closed","vertical_shades","curtains_closed","mode_heat_off","mode_cool_off","tamper_detection_off","shelves","stadia_controller","stadia_controller","temp_preferences_custom","door_open","power_rounded","nest_eco_leaf","device_reset","nest_clock_farsight_analog","nest_remote_comfort_sensor","laundry","battery_horiz_075","shield_with_heart","temp_preferences_eco","familiar_face_and_zone","tools_power_drill","airwave","productivity","battery_horiz_050","nest_heat_link_gen_3","nest_display","weather_snowy","activity_zone","ev_charger","nest_remote","cleaning_bucket","settings_alert","nest_cam_indoor","arrows_more_up","nest_heat_link_e","home_storage","nest_multi_room","nest_secure_alarm","battery_horiz_000","nest_cam_outdoor","light_group","detection_and_zone","nest_thermostat_gen_3","mfg_nest_yale_lock","tools_pliers_wire_stripper","nest_cam_iq_outdoor","tools_ladder","detector_alarm","nest_cam_iq","nest_clock_farsight_digital","early_on","floor_lamp","nest_mini","auto_activity_zone","home_speaker","auto_schedule","home_max_dots","nest_hello_doorbell","nest_audio","nest_wifi_router","house_with_shield","zone_person_urgent","motion_sensor_active","nest_display_max","cool_to_dry","nest_farsight_weather","shield_with_house","chromecast_2","battery_profile","window_closed","heat_pump_balance","arming_countdown","nest_found_savings","self_care","battery_vert_050","detector_status","tools_level","window_open","nest_thermostat_zirconium_eu","arrows_more_down","nest_true_radiant","nest_cam_wired_stand","zone_person_alert","climate_mini_split","detector","nest_detect","nest_wifi_mistral","nest_wifi_point","quiet_time","door_sensor","nest_cam_floodlight","nest_doorbell_visitor","nest_tag","tools_installation_kit","battery_vert_020","nest_connect","battery_vert_005","nest_thermostat_sensor_eu","nest_thermostat_sensor","tools_phillips","nest_sunblock","nest_wifi_gale","nest_wifi_point_vento","nest_thermostat_e_eu","doorbell_chime","detector_co","detector_battery","tools_flat_head","nest_wake_on_approach","nest_wake_on_press","motion_sensor_urgent","motion_sensor_alert","window_sensor","table_lamp","tamper_detection_on","nest_cam_magnet_mount","zone_person_idle","quiet_time_active","nest_cam_stand","detector_offline","nest_cam_wall_mount","wall_lamp","nest_locator_tag","motion_sensor_idle","assistant_on_hub","g_translate","g_translate","launcher_assistant_on","fitbit_hourly_activity","nightlight_off","blood_pressure","blood_pressure","keyboard_tab_rtl","contrast_rtl_off"]');
    CBS.addElement('material-icon', CBS_MaterialIcon);
    prefix = prefix ? prefix + '-' : '';
    const i = new CBS_MaterialIcon();
    icons.forEach(icon => {
        icon = prefix + icon;
        // buttons
        const btn = new CBS_Button();
        i.icon = icon;
        btn.content = i;
        CBS_Button.addTemplate(icon, btn);
        // texts
        [
            CBS_H1,
            CBS_H2,
            CBS_H3,
            CBS_H4,
            CBS_H5,
            CBS_H6,
            CBS_Anchor
        ].forEach(c => {
            const el = new c();
            el.append(i.clone());
            c.addTemplate(icon, el);
        });
    });
};
const t = CBS.createElement('toast');
