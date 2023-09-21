import { CBS_Node, CBS_Element, CBS_Options } from "./2-element.ts";
import { CBS_Elements, CBS_ElementName } from "./0-types.ts";
import { CBS_Class } from "./classes.ts";
import { CBS_Component } from "./3-components.ts";
import { CBS_Button } from "../components/1-general/1-button.ts";
import { CBS_Modal } from "../components/1-general/modal.ts";
import { CBS_Form } from "../components/form-inputs/0-form.ts";
import { CBS_TextInput } from "../components/form-inputs/text.ts";
import { CBS_Container } from "../components/0-grid/container.ts";
import { CBS_ModalOptions } from "../components/1-general/modal.ts";

// Generic types
/**
 * Generic types for the library
 *
 * @typedef {CBS_NodeContainer}
 */
export type CBS_NodeContainer = {
    [key: string]: CBS_Node;
}

// Used for subcomponents
/**
 * Used for subcomponents
 *
 * @typedef {CBS_ElementContainer}
 */
export type CBS_ElementContainer = {
    [key: string]: CBS_Element;
}

// Used for parameters
/**
 * Used for parameters
 *
 * @typedef {CBS_ParameterValue}
 */
export type CBS_ParameterValue = string|number|boolean|HTMLElement|undefined|Element|Node;

/**
 * Used for parameters
 *
 * @typedef {CBS_Parameters}
 */
export type CBS_Parameters = {
    [key: string]: CBS_ParameterValue;
}




/**
 * Selector object returned by CustomBootstrap.parseSelector()
 *
 * @typedef {Selector}
 */
export type Selector = {
    tag: string;
    id?: string;
    classes?: string[];
    attributes?: {
        [key: string]: string;
    };
}

/**
 * Not currently used, but it's for someMethod() to return the constructor, not the element
 *
 * @typedef {CBS_ElementConstructorMap}
 */
export type CBS_ElementConstructorMap = {
    [key: string]: new <type = unknown>(options?: CBS_Options) => CBS_Element;
}

/**
 * Container for all of the CustomBootstrap library
 *
 * @class CustomBootstrap
 * @typedef {CustomBootstrap}
 */
export class CustomBootstrap {
    static ids: string[] = [];

    static getAllParentNodes(el: HTMLElement): Node[] {
        const nodeList: Node[] = [];

        let prevLength = nodeList.length;

        while(prevLength === nodeList.length) {
            if (el.parentElement) nodeList.push(el.parentElement);

            prevLength = nodeList.length;
        }

        return nodeList;
    }

    static newID(): string {
        let id: string;
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
    static parseSelector(selector: string): Selector {
        selector = selector.trim();

        const getTag = (selector: string): string => {
            // get first word (before ., #, or [])
            const tag = selector.match(/^[^.#[]+/);
            return tag ? tag[0] : '';
        };

        const getId = (selector: string): string => {
            // get id (after #, and before . or [ or end of string)
            const id = selector.match(/#[^.#[\]]+/);
            return id ? id[0].substring(1) : '';
        }

        const getClasses = (selector: string): string[] => {
            // get classes (after ., and before # or [ or end of string)
            const classes = selector.match(/\.[^.#[\]]+/g);
            return classes ? classes.map(c => c.substring(1)) : [];
        }

        const getAttributes = (selector: string): { [key: string]: string } => {
            // get attributes (after [, and before ] or end of string)
            const attributes = selector.match(/\[[^\]]+\]/g);
            if (!attributes) return {};

            const result: { [key: string]: string } = {};
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
    #elements: CBS_ElementConstructorMap = {
    };

    /**
     * Adds an element to the CustomBootstrap library
     *
     * @param {string} name
     * @param {new (options?: CBS_Options) => CBS_Element} element
     * @returns {(CBS_Element) => void}
     */
    addElement(name: keyof CBS_Elements, element: new (options?: CBS_Options) => CBS_Element) {
        this.#elements[name] = element;
    }


    /**
     * Creates an element from a selector string
     *
     * @param {string} selector
     * @param {?CBS_Options} [options]
     * @returns {CBS_Element}
     */
    createElement<K extends CBS_ElementName = CBS_ElementName, type = unknown>(selector: K, options?: CBS_Elements[K][0]): CBS_Elements<type>[K][1];
    createElement<K extends CBS_ElementName = CBS_ElementName, type = unknown>(tag: CBS_ElementName, options?: CBS_Options): CBS_Element {
        const element = this.#elements[tag];

        if (!element) {
            const err = new Error('Element not found: ' + tag + ' Returning a CBS_Element instead');
            console.warn(err);
            return new CBS_Element(options);
        }

        return new element<type>(options);
    }

    createDomFromElement(el: HTMLDivElement) {
        const dom = this.createElement('dom');
        dom.el = el;
        return dom;
    }


    /**
     * Creates an element from an html string
     * 
     * @param {string} text
     * @returns {(ChildNode|null)}
     */
    createElementFromText<type>(text: string): (Element|ChildNode|(CBS_Elements<type>[keyof CBS_Elements])[1])[] {
        const div = document.createElement('div');
        div.innerHTML = text;
        const fullArray = Array.from(div.querySelectorAll('*'));

        const collected: any[] = [];

        return fullArray.map((el) => {
            // console.log(el);
            const tag = el.tagName.toLowerCase();
            if (tag.includes('cbs-')) {
                const [,element] = tag.split('cbs-');
                let cbsEl = CBS.createElement<CBS_ElementName, type>(element as CBS_ElementName);

                // if ((el as HTMLElement).dataset.template) {
                //     cbsEl = cbsEl.constructor.fromTemplate((el as HTMLElement).dataset.template);
                // }

                // defining properties
                Array.from(el.attributes).forEach((attr) => {
                    cbsEl.setAttribute(attr.name, attr.value);
                });
                cbsEl.addClass(...Array.from(el.classList) as CBS_Class[]);

                for (const key in Object.keys((el as HTMLElement).style)) {
                    if (!(el as HTMLElement).style[key]) continue;
                    cbsEl.el.style[key] = (el as HTMLElement).style[key];
                }

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
                                } else {
                                    return -1;
                                }
                            });

                            (cbsEl as CBS_Component).subcomponents[name].el.append(...subElements);
                            collected.push(subEl);
                        } else {
                            try {
                                cbsEl.removeElement((cbsEl as CBS_Component).subcomponents[name]);
                            } catch (e) {
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
    async alert(message: any): Promise<void> {
        return new Promise((res, rej) => {
            const ok = new CBS_Button({
                color: 'primary'
            });

            ok.append('Okay');

            const modal = new CBS_Modal({
                buttons: [
                    ok
                ]
            });

            modal.title.append('Alert');
            modal.body.append(message);

            ok.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res();
            });

            modal.on('hidden.bs.modal', () => res());
            modal.on('el.destroy', () => res());
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
    async confirm(message: any): Promise<boolean> {
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

            modal.title.append('Confirm');

            modal.body.append(message);

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
            modal.on('el.destroy', () => res(false));
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
    async modalForm(form: CBS_Form): Promise<any> {
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

            modal.title.append('Fill out form');

            modal.body.append(form);
            modal.footer.append(submit);

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
            modal.on('el.destroy', () => res(null));
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
    async prompt(message?: any): Promise<string|null> {
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

            modal.title.append('Prompt');
    
            const input = new CBS_TextInput();

            modal.body.append(message);
            modal.body.append(input);

            input.on('keydown', (e) => {
                if ((e as KeyboardEvent).key === 'Enter') {
                    submit.el.click();
                }
            })

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

            modal.footer.append(submit);

            modal.on('hidden.bs.modal', () => res(null));
            modal.on('el.destroy', () => res(null));
            modal.show();
        });
    }

    modal(container: CBS_Container, options?: CBS_ModalOptions) {
        const modal = new CBS_Modal(options);
        modal.body.append(container);
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
export default CBS;
(() => {
    // test for jQuery and popper
    try {
        $('hello-world');

        if (!$(document.createElement('button')).toast) {
            console.error('Popper is not loaded!');
        }
    } catch {
        console.error('jQuery is not loaded!');
    }
});