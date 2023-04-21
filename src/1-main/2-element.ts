type CBS_Node = CBS_Element|Node|string;

// used in CBS_Element.components
type CBS_NodeMap = CBS_Node[];

// Passed into every CBS_Element constructor
class CBS_Options {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}


class CBS_Element extends CustomBootstrap {
    /**
     * The templates that can be used to create new elements built off of this class
     */
    static #templates: { [key: string]: CBS_Element } = {
        'default': new CBS_Element()
    };


    /**
     * This is currently in progress and is not ready for use
     * 
     * @deprecated
     * @param type key of the template to use
     * @returns a new class that extends the template
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
        c.prototype.subcomponents = template.subcomponents;
        c.prototype.parameters = template.parameters;
        c.prototype._el = template._el.cloneNode(true) as HTMLElement;
        c.prototype._options = template._options;
        c.prototype.#events = template.#events;
        c.prototype.#components = template.#components;
        c.prototype.#customEvents = template.#customEvents;

        return c;
    }

    /**
     * Generates a new element from a template
     * @param type Key of the template to use
     * @param options Options to pass to the new element
     * @returns a new element built off of the template
     */
    static fromTemplate(type: string, options?: CBS_Options): CBS_Element {
        const el = (this.templates[type] || this.templates['default']).clone(true);
        el.options = options || {};
        return el;
    }

    private static get templates(): { [key: string]: CBS_Element } {
        return this.#templates;
    }

    /**
     * Creates a new template to be used by the class
     * @param type key of the template to add
     * @param template the template to add
     * @returns {boolean} true if the template was added, false if the template already exists
     */
    public static addTemplate(type: string, template: CBS_Element): boolean {
        if (template.constructor.name !== this.name) {
            throw new Error(`Template must be of type ${this.name}`);
        }


        if (this.#templates[type]) return false;
        this.#templates[type] = template;
        return true;
    }





    // default properties
    #parameters: CBS_Parameters = {};
    _el: HTMLElement = document.createElement('div');
    listeners: CBS_Listener[] = [];
    #events: { [key: string]: CBS_ListenerCallback } = {};
    #components: CBS_NodeMap = [];
    subcomponents: CBS_NodeContainer = {};
    _options: CBS_Options = {};



    // custom events on all elements
    #customEvents: string[] = [
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


    static get customEvents(): string[] {
        return this.prototype.#customEvents;
    }

    static set customEvents(events: string[]) {
        this.prototype.#customEvents = events;
    }

    /**
     * Add a single custom event to the prototype
     * @param {string} event string
     */
    static addCustomEvent(event: string) {
        this.prototype.#customEvents.push(event);
    }

    /**
     * Remove a single custom event from the prototype
     * @param {string} event string
     */
    static removeCustomEvent(event: string) {
        this.prototype.#customEvents = this.customEvents.filter(e => e !== event);
    }

    /**
     * Add multiple custom events to the prototype
     * @param {...string} events strings
     */
    static addCustomEvents(...events: string[]) {
        this.prototype.#customEvents.push(...events);
    }

    /**
     * Remove multiple custom events from the prototype
     * @param {...string} events strings
     */
    static removeCustomEvents(...events: string[]) {
        this.prototype.#customEvents = this.customEvents.filter(e => !events.includes(e));
    }





    /**
     * 
     * @param {CBS_Options} options
     */
    constructor(options?: CBS_Options) {
        super();

        this.options = options || {};
    }

    get options(): CBS_Options {
        return this._options;
    }

    set options(options: CBS_Options) {
        if (!this._el) return;

        this._options = options;

        const { classes, id, style, attributes } = options;

        if (classes?.length) {
            this._el.classList.add(...classes);
        }

        if (id) {
            this._el.id = id;
        }

        if (style) {
            this._el.setAttribute('style', Object.entries(style).map(([key, val]) => {
                return `${key}: ${val};`;
            }).join() || '');
        }

        if (attributes) {
            Object.entries(attributes).forEach(([value, key]) => {
                this._el.setAttribute(key, value);
            });
        }

        this.trigger('options:change');
    }

    get el(): HTMLElement {
        return this._el;
    }

    set el(el: HTMLElement) {
        this._el = el;
        this.options = this._options;

        Object.entries(this.#events).forEach(([event, callback]) => {
            this._el.addEventListener(event, callback);
        });

        this.trigger('element:change');
    }





    append(...elements: CBS_NodeMap) {
        elements.forEach(el => {
            if (el instanceof CBS_Element) {
                this._el.appendChild(el._el);
            } else if (typeof el === 'string') {
                this._el.innerHTML += el;
            } else {
                this._el.appendChild(el);
            }
        });

        this.#components.push(...elements);

        this.render();
    }

    removeElement(...elements: CBS_NodeMap) {
        elements.forEach(el => {
            if (el instanceof CBS_Element) {
                this._el.removeChild(el._el);
            } else if (typeof el === 'string') {
                this._el.innerHTML = this._el.innerHTML.replace(el, '');
            } else {
                this._el.removeChild(el);
            }
        });

        this.#components = this.#components.filter(e => !elements.includes(e));
    }

    prepend(...elements: CBS_NodeMap) {
        elements.forEach(el => {
            if (el instanceof CBS_Element) {
                this._el.prepend(el._el);
            } else if (typeof el === 'string') {
                this._el.innerHTML = el + this._el.innerHTML;
            } else {
                this._el.prepend(el);
            }
        });

        this.#components.unshift(...elements);

        this.render();
    }

    replace(nodeToReplace: CBS_Node, ...elementsToAdd: CBS_NodeMap) {
        if (this.#components.includes(nodeToReplace)) {
            const index = this.#components.indexOf(nodeToReplace);
            this.insertAfter(nodeToReplace, ...elementsToAdd);
            this.removeElement(nodeToReplace);
        }

        this.render();
    }

    insertBefore(nodeToInsertBefore: CBS_Node, ...elementsToAdd: CBS_NodeMap) {
        if (this.#components.includes(nodeToInsertBefore)) {
            const index = this.#components.indexOf(nodeToInsertBefore);
            this.#components.splice(index, 0, ...elementsToAdd);

            let node: Node|null;

            // adds elements to components
            if (nodeToInsertBefore instanceof CBS_Element) {
                node = nodeToInsertBefore._el;
            } else if (typeof nodeToInsertBefore === 'string') { 
                node = this.createElementFromText(nodeToInsertBefore);
            } else {
                node = nodeToInsertBefore;
            }

            // adds elements to the DOM
            elementsToAdd.forEach((el, i) => {
                if (el instanceof CBS_Element) {
                    this._el.insertBefore(el._el, node);
                } else if (typeof el === 'string') {
                    const div = document.createElement('div');
                    div.innerHTML = el;
                    this._el.insertBefore(div, node);
                } else {
                    this._el.insertBefore(el, node);
                }
            });
        }

        this.render();
    }

    insertAfter(nodeToInsertAfter: CBS_Node, ...elementsToAdd: CBS_NodeMap) {
        if (this.#components.includes(nodeToInsertAfter)) {
            const index = this.#components.indexOf(nodeToInsertAfter);
            const nextNode = this.#components[index + 1];

            if (nextNode) {
                this.insertBefore(nextNode, ...elementsToAdd);
            } else {
                this.append(...elementsToAdd);
            }
        }
    }

    get children(): CBS_NodeMap {
        return this.#components;
    }

    get parent(): HTMLElement|null {
        return this._el.parentElement;
    }











    // █▀▄ ▄▀▄ █▀▄ ▄▀▄ █▄ ▄█ ██▀ ▀█▀ ██▀ █▀▄ ▄▀▀ 
    // █▀  █▀█ █▀▄ █▀█ █ ▀ █ █▄▄  █  █▄▄ █▀▄ ▄█▀ 

    render() {
        const { parameters } = this;
        
        const isShallow = (el: Element): boolean => !el.children.length;

        if (this._el) {
            this._el.querySelectorAll('[data-cbs-replace]').forEach(e => {
                const replacement = document.createElement('div');
                replacement.dataset[`cbs-${this.constructor.name}`] = e.getAttribute('data-cbs-replace') || '';

                e.replaceWith(replacement);
            });

            const matches = Array.from(this._el.querySelectorAll('*')).filter(el => el.innerHTML.match(/{{.*}}/));

            matches.forEach(match => {
                if (isShallow(match)) {
                    const params = match.innerHTML.match(/{{.*}}/g);
                    params?.forEach(param => {
                        const key = param.replace(/[{}]/g, '');
                        const value = `<span data-cbs-${this.constructor.name}="${key}"></span>`;
                        match.innerHTML = match.innerHTML.replace(param, value);
                    });
                }
            });
        }

        Object.entries(parameters).forEach(([key, value]) => {
            this.write(key, value);
        });
    }
    
    write(key: string, value: CBS_ParameterValue) {
        if (this._el) {
            this._el.querySelectorAll(`[data-cbs-${this.constructor.name}="${key}"]`).forEach(el => {
                if (typeof value === 'string' || typeof value === 'number') {
                    el.innerHTML = value.toString();
                } else if (typeof value === 'boolean') {
                    el.innerHTML = value ? 'true' : 'false';
                } else if (typeof value === 'undefined') {
                    el.innerHTML = '';
                } else if (value instanceof HTMLElement) {
                    while (el.firstChild) {
                        el.removeChild(el.firstChild);
                    }
                    el.appendChild(value);
                } else {
                    console.error('Invalid value type', value);
                }
            });

            this.parameters[key] = value;

            this.trigger('param:write');
        }
    }

    read(param: string, asHTML:boolean = false): CBS_ParameterValue[] {
        if (this._el) {
            this.trigger('param:read');

            const arr = Array.from(this._el.querySelectorAll(`[data-cbs-${this.constructor.name}="${param}"]`));
            if (asHTML) return arr.map(el => el.children[0] || el);
            return arr.map(el => el.innerHTML);
        }
        return [];
    }

    get parameters(): CBS_Parameters {
        return this.#parameters;
    }

    set parameters(params: CBS_Parameters) {
        this.#parameters = params;
        this.render();
    }



















    // █   █ ▄▀▀ ▀█▀ ██▀ █▄ █ ██▀ █▀▄ ▄▀▀ 
    // █▄▄ █ ▄█▀  █  █▄▄ █ ▀█ █▄▄ █▀▄ ▄█▀ 

    on(event: string, callback: CBS_ListenerCallback, isAsync: boolean = false) {
        if (!this._el) throw new Error('No element to add listener to');
        if (typeof event !== 'string') throw new Error('Event must be a string');
        if (typeof callback !== 'function') throw new Error('Callback must be a function');
        // if (options && typeof options !== 'object') throw new Error('Options must be an object');

        const errCallback = async(e: Event): Promise<boolean> => {
            return new Promise((res,rej) => {
                let success = true;
                const listeners = this.listeners.filter(l => l.event === event);

                listeners.filter(l => l.isAsync).forEach(async l => l.callback(e));

                for (const listener of listeners.filter(l => !l.isAsync)) {
                    try {
                        listener.callback(e);
                    } catch (err) {
                        success = false;
                        console.error(err);
                    }
                }

                return res(success);
            });
        }

        this.listeners.push(new CBS_Listener(event, callback, isAsync));

        if (!this.has(event)) {
            this.#events[event] = errCallback;
            this._el.addEventListener(event, errCallback);
        }

    }

    has(event: string): boolean {
        return !!this.#events[event];
    }

    off(event?: string, callback?: CBS_ListenerCallback) {
        if (!this._el) throw new Error('No element to remove event listener from');

        if (!event) {
            this.listeners = [];
            Object.entries(this.#events).forEach(([event, cb]) => {
                this._el.removeEventListener(event, cb);
            });
            this.#events = {};
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
            this._el.removeEventListener(event, this.#events[event]);
            delete this.#events[event];
        }
    }

    async trigger(event: string, options?: EventInit): Promise<boolean> {
        return new Promise((res,rej) => {
            if (!this._el) throw new Error('No element to trigger event on');

            if (typeof event !== 'string') throw new Error('event must be a string, received ' + typeof event);

            if (this.constructor.prototype.customEvents.includes(event)) {
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






    /**
     * Hides the element (adds d-none class)
     */
    hide() {
        this._el.classList.add('d-none');

        this.trigger('el:hide');
    }

    /**
     * Shows the element (removes d-none class)
     */
    show() {
        this._el.classList.remove('d-none');

        this.trigger('el:show');
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

    destroy() {
        this.trigger('el:destroy');

        this.off();
        this.#components.forEach(c => {
            if (c instanceof CBS_Element) c.destroy();
        });
        this._el.remove();
    }




    /**
     * Clones this 
     * @param {Boolean} listeners Whether or not to clone all listeners (default: true)
     * @returns {CBS_Element} A clone of this
     */
    clone(listeners: boolean = true): CBS_Element {
        // this will probably need to be changed for every extension of this class

        const clone = CBS.createElement(this.constructor.name);

        clone._el = this._el.cloneNode(true) as HTMLElement;

        // clones all listeners too
        if (listeners) this.listeners.forEach(listener => {
            clone.on(listener.event, listener.callback);
        });

        this.trigger('el:clone');

        return clone;
    }
};