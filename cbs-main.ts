
type ElementContainer = {
    [key: string]: typeof CBS_Element;
}

type CBS_Value = string|number|boolean|HTMLElement|undefined|Element|Node;

type CBS_Parameters = {
    [key: string]: CBS_Value;
}

type CBS_ListenerCallback = (event: Event) => void;

class CBS_Listener {
    event: string;
    callback: CBS_ListenerCallback;
    // options?: AddEventListenerOptions;
    isAsync: boolean = true;

    constructor(event: string, callback: CBS_ListenerCallback, isAsync: boolean = true) {
        this.event = event;
        this.callback = callback;
        this.isAsync = isAsync;
    }
}

type CBS_Event = {
    event: string;
    callback: CBS_ListenerCallback;
    // options?: AddEventListenerOptions;
    isAsync: boolean;
}




interface CBS_ElementNameMap {
    'select': CBS_Select;
}

interface CBS {
    createElement<K extends keyof CBS_ElementNameMap>(tagName: K): CBS_ElementNameMap[K];
}

class CustomBootstrap implements CBS {
    createElement(tagName: string): CBS_Element {
        switch (tagName) {
            case 'select':
                return new CBS_Select();
            // case 'button':
            //     return new CBS_Button();
            // case 'input':
            //     return new CBS_Input();
            // case 'textarea':
            //     return new CBS_Textarea();
            // case 'checkbox':
            //     return new CBS_Checkbox();
            // case 'radio':
            //     return new CBS_Radio();
            // case 'label':
            //     return new CBS_Label();
            // case 'form':
            //     return new CBS_Form();
            // case 'modal':
            //     return new CBS_Modal();
            // case 'alert':
            //     return new CBS_Alert();
            // case 'card':
            //     return new CBS_Card();
            // case 'collapse':
            //     return new CBS_Collapse();
            // case 'dropdown':
            //     return new CBS_Dropdown();
            // case 'tab':
            //     return new CBS_Tab();
            // case 'table':
            //     return new CBS_Table();
            // case 'list':
            //     return new CBS_List();
            // case 'navbar':
            //     return new CBS_Navbar();
            // case 'progress':
            //     return new CBS_Progress();
            // case 'spinner':
            //     return new CBS_Spinner();
            // case 'tooltip':
            //     return new CBS_Tooltip();
            // case 'popover':
            //     return new CBS_Popover();
            // case 'carousel':
            //     return new CBS_Carousel();
            // case 'badge':
            //     return new CBS_Badge();
            // case 'breadcrumb':
            //     return new CBS_Breadcrumb();
            // case 'pagination':
            //     return new CBS_Pagination();
            // case 'toast':
            //     return new CBS_Toast();
            // case 'accordion':
            //     return new CBS_Accordion();
            // case 'image':
            //     return new CBS_Image();
            // case 'video':
            //     return new CBS_Video();
            // case 'iframe':
            //     return new CBS_Iframe();
            // case 'embed':
            //     return new CBS_Embed();
            // case 'audio':
            //     return new CBS_Audio();
            default:
                return new CBS_Element();
        }
    }
}

class CBS_Element extends CustomBootstrap {
    parameters: CBS_Parameters = {};
    el: HTMLElement = document.createElement('div');
    listeners: CBS_Listener[] = [];
    #events: { [key: string]: CBS_ListenerCallback } = {};

    constructor() {
        super();
    }

    render() {
        const { parameters } = this;
        
        const isShallow = (el: Element): boolean => !el.children.length;

        if (this.el) {
            this.el.querySelectorAll('[data-cbs-replace]').forEach(e => {
                const replacement = document.createElement('div');
                replacement.dataset[`cbs-${this.constructor.name}`] = e.getAttribute('data-cbs-replace') || '';

                e.replaceWith(replacement);
            });

            const matches = Array.from(this.el.querySelectorAll('*')).filter(el => el.innerHTML.match(/{{.*}}/));

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
    
    write(key: string, value: CBS_Value) {
        if (this.el) {
            this.el.querySelectorAll(`[data-cbs-${this.constructor.name}="${key}"]`).forEach(el => {
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
        }
    }

    read(param: string, asHTML:boolean = false): CBS_Value[] {
        if (this.el) {
            const arr = Array.from(this.el.querySelectorAll(`[data-cbs-${this.constructor.name}="${param}"]`));
            if (asHTML) return arr.map(el => el.children[0] || el);
            return arr.map(el => el.innerHTML);
        }
        return [];
    }




    on(event: string, callback: CBS_ListenerCallback, isAsync: boolean = false) {
        if (!this.el) throw new Error('No element to add listener to');
        if (typeof event !== 'string') throw new Error('Event must be a string');
        if (typeof callback !== 'function') throw new Error('Callback must be a function');
        // if (options && typeof options !== 'object') throw new Error('Options must be an object');

        const errCallback = async(e: Event): Promise<boolean> => {
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

            return success;
        }

        if (!this.has(event)) {
            this.el.addEventListener(event, errCallback);
            this.#events[event] = errCallback;
        }

        this.listeners.push(new CBS_Listener(event, callback, isAsync));
    }

    has(event: string): boolean {
        return !!this.#events[event];
    }

    off(event: string, callback: CBS_ListenerCallback) {
        if (!this.el) throw new Error('No element to remove event listener from');

        if (!event) {
            this.listeners = [];
            Object.entries(this.#events).forEach(([event, cb]) => {
                this.el.removeEventListener(event, cb);
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
            this.el.removeEventListener(event, this.#events[event]);
            delete this.#events[event];
        }
    }

    

    /**
     * Hides the element (adds d-none class)
     */
    hide() {
        this.el.classList.add('d-none');
    }

    /**
     * Shows the element (removes d-none class)
     */
    show() {
        this.el.classList.remove('d-none');
    }

    /**
     * Tests if the element is hidden (has the d-none class)
     */
    get isHidden() {
        return this.el.classList.contains('d-none');
    }

    /**
     * Toggles the d-none class
     */
    toggleHide() {
        this.el.classList.toggle('d-none');
    }

    destroy() {
        this.el.remove();
    }




    /**
     * Clones this 
     * @param {Boolean} listeners Whether or not to clone all listeners (default: true)
     * @returns {CBS_Element} A clone of this
     */
    clone(listeners: boolean = true): CBS_Element {
        // this will probably need to be changed for every extension of this class

        const clone = CBS.createElement(this.constructor.name);

        clone.el = this.el.cloneNode(true) as HTMLElement;

        // clones all listeners too
        if (listeners) this.listeners.forEach(listener => {
            clone.on(listener.event, listener.callback);
        });

        return clone;
    }
};


const CBS = new CustomBootstrap();