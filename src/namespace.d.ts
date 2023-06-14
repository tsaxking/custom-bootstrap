export {}

declare global {
/**
 * Generic types for the library
 *
 * @typedef {CBS_NodeContainer}
 */
type CBS_NodeContainer = {
    [key: string]: CBS_Node;
};
/**
 * Used for subcomponents
 *
 * @typedef {CBS_ElementContainer}
 */
type CBS_ElementContainer = {
    [key: string]: CBS_Element;
};
/**
 * Used for parameters
 *
 * @typedef {CBS_ParameterValue}
 */
type CBS_ParameterValue = string | number | boolean | HTMLElement | undefined | Element | Node;
/**
 * Used for parameters
 *
 * @typedef {CBS_Parameters}
 */
type CBS_Parameters = {
    [key: string]: CBS_ParameterValue;
};
/**
 * Selector object returned by CustomBootstrap.parseSelector()
 *
 * @typedef {Selector}
 */
type Selector = {
    tag: string;
    id?: string;
    classes?: string[];
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Not currently used, but it's for someMethod() to return the constructor, not the element
 *
 * @typedef {CBS_ElementConstructorMap}
 */
type CBS_ElementConstructorMap = {
    [key: string]: new (options?: CBS_Options) => CBS_Element;
};
/**
 * Container for all of the CustomBootstrap library
 *
 * @class CustomBootstrap
 * @typedef {CustomBootstrap}
 */
export class CustomBootstrap {
    #private;
    static ids: string[];
    static getAllParentNodes(el: HTMLElement): Node[];
    static newID(): string;
    /**
     * Parses a string into a selector object
     *
     * @static
     * @param {string} selector
     * @returns {Selector}
     */
    static parseSelector(selector: string): Selector;
    /**
     * Adds an element to the CustomBootstrap library
     *
     * @param {string} name
     * @param {new (options?: CBS_Options) => CBS_Element} element
     * @returns {(CBS_Element) => void}
     */
    addElement(name: string, element: new (options?: CBS_Options) => CBS_Element): void;
    /**
     * Creates an element from a selector string
     *
     * @param {string} selector
     * @param {?CBS_Options} [options]
     * @returns {CBS_Element}
     */
    createElement(selector: string, options?: CBS_Options): CBS_Element;
    /**
     * Creates an element from an html string
     *
     * @param {string} text
     * @returns {(ChildNode|null)}
     */
    createElementFromText(text: string): (ChildNode | CBS_Element)[];
    /**
     * Replacement for alert() that uses modals
     * Returns a promise that resolves when the modal is closed
     *
     * @async
     * @param {*} message
     * @returns {Promise<void>}
     */
    alert(message: any): Promise<void>;
    /**
     * Replacement for confirm() that uses modals
     * Returns a promise that resolves to true if the user clicks Okay, false if the user clicks Cancel
     *
     * @async
     * @param {*} message
     * @returns {Promise<boolean>}
     */
    confirm(message: any): Promise<boolean>;
    /**
     * Returns a promise that resolves to the value of the form input if the user clicks Submit, null if the user clicks Cancel
     *
     * @async
     * @param {CBS_Form} form
     * @returns {Promise<any>}
     */
    modalForm(form: CBS_Form): Promise<any>;
    /**
     * Replacement for prompt() that uses modals
     * Returns a promise that resolves to the value of the input if the user clicks Okay, null if the user clicks Cancel
     *
     * @async
     * @param {?*} [message]
     * @returns {Promise<string|null>}
     */
    prompt(message?: any): Promise<string | null>;
    modal(container: CBS_Container): CBS_Modal;
}
/**
 * The global CustomBootstrap instance
 *
 * @type {CustomBootstrap}
 */
export const CBS: CustomBootstrap;
/**
 * Generic Node
 *
 * @typedef {CBS_Node}
 */
type CBS_Node = CBS_Element | Node | string;
/**
 * Generic NodeMap
 *
 * @typedef {CBS_NodeMap}
 */
type CBS_NodeMap = CBS_Node[];
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
    classes?: string[];
    /**
     * Id to be added to the element
     *
     * @type {?string}
     */
    id?: string;
    /**
     * Style to be added to the element
     *
     * @type {?object}
     */
    style?: object;
    /**
     * Attributes to be added to the element
     *
     * @type {?object}
     */
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @typedef {CBS_PropertyMap}
 */
type CBS_PropertyMap = {
    [key: string]: number | undefined;
};
/**
 * Description placeholder
 *
 * @typedef {CBS_Properties}
 */
type CBS_Properties = {
    padding: CBS_PropertyMap;
    margin: CBS_PropertyMap;
};
/**
 * Element container
 *
 * @class CBS_Element
 * @typedef {CBS_Element}
 * @extends {CustomBootstrap}
 */
export class CBS_Element extends CustomBootstrap {
    /**
     * All templates for this class
     *
     * @static
     * @type {{ [key: string]: CBS_Element }}
     */
    static _templates: {
        [key: string]: CBS_Element;
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
    static classFromTemplate(type: string): new () => CBS_Element;
    /**
     * Generates a premade template from a string
     *
     * @static
     * @param {string} type
     * @param {?CBS_Options} [options]
     * @returns {CBS_Element}
     */
    static fromTemplate(type: string, options?: CBS_Options): CBS_Element;
    /**
     * All templates for this class
     *
     * @private
     * @static
     * @readonly
     * @type {{ [key: string]: CBS_Element }}
     */
    private static get templates();
    /**
     * Adds a template to the class
     *
     * @public
     * @static
     * @param {string} type
     * @param {CBS_Element} template
     * @returns {boolean}
     */
    static addTemplate(type: string, template: CBS_Element): boolean;
    /**
     * Parameters (used in writing/reading)
     *
     * @type {CBS_Parameters}
     */
    _parameters: CBS_Parameters;
    /**
     * The element this class represents
     *
     * @type {HTMLElement}
     */
    _el: HTMLElement;
    /**
     * All listeners for this element
     *
     * @type {CBS_Listener[]}
     */
    listeners: CBS_Listener[];
    /**
     * All events and their respective callbacks (used in dispatching)
     *
     * @type {{ [key: string]: CBS_ListenerCallback }}
     */
    _events: {
        [key: string]: CBS_ListenerCallback;
    };
    /**
     * All components
     *
     * @type {CBS_NodeMap}
     */
    _components: CBS_NodeMap;
    /**
     * All options for this element
     *
     * @type {CBS_Options}
     */
    _options: CBS_Options;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {CBS_NodeMap}
     */
    get components(): CBS_NodeMap;
    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    _padding: CBS_PropertyMap;
    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    _margin: CBS_PropertyMap;
    /**
     * Description placeholder
     *
     * @private
     * @param {string} paddingOrMargin
     * @param {string} key
     * @param {(number|undefined)} value
     */
    private setPaddingOrMargin;
    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    set allPadding(padding: CBS_PropertyMap);
    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    get allPadding(): CBS_PropertyMap;
    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    set allMargin(margin: CBS_PropertyMap);
    /**
     * Description placeholder
     *
     * @type {CBS_PropertyMap}
     */
    get allMargin(): CBS_PropertyMap;
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set padding(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingX(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingY(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingS(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingE(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingT(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set paddingB(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set margin(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginX(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginY(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginS(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginE(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginT(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set marginB(value: number | undefined);
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get padding(): number | undefined;
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingX(): number | undefined;
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingY(): number | undefined;
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingS(): number | undefined;
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingE(): number | undefined;
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingT(): number | undefined;
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get paddingB(): number | undefined;
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get margin(): number | undefined;
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginX(): number | undefined;
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginY(): number | undefined;
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginS(): number | undefined;
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginE(): number | undefined;
    /**
     * Description placeholder
     *
     * @type {(number|undefined)}
     */
    get marginT(): number | undefined;
    /**
     * All custom events for this element
     *
     * @type {string[]}
     */
    static _customEvents: string[];
    /**
     * Gets all custom events for this element
     *
     * @static
     * @type {string[]}
     */
    static get customEvents(): string[];
    /**
     * Sets all custom events for this element
     *
     * @static
     * @type {{}}
     */
    static set customEvents(events: string[]);
    /**
     * Adds a single custom event to the prototype
     *
     * @static
     * @param {string} event
     */
    static addCustomEvent(event: string): void;
    /**
     * Removes a single custom event from the prototype
     *
     * @static
     * @param {string} event
     */
    static removeCustomEvent(event: string): void;
    /**
     * Adds multiple custom events to the prototype
     *
     * @static
     * @param {...string[]} events
     */
    static addCustomEvents(...events: string[]): void;
    /**
     * Removes multiple custom events from the prototype
     *
     * @static
     * @param {...string[]} events
     */
    static removeCustomEvents(...events: string[]): void;
    /**
     * Creates an instance of CBS_Element
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options);
    /**
     * Gets the options for this element
     *
     * @type {CBS_Options}
     */
    get options(): CBS_Options;
    /**
     * Sets the options for this element and renders
     *
     * @type {CBS_Options}
     */
    set options(options: CBS_Options);
    /**
     * Gets the element this class represents
     *
     * @type {HTMLElement}
     */
    get el(): HTMLElement;
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
    set el(el: HTMLElement);
    _id: string;
    get id(): string;
    set id(id: string);
    /**
     * Appends an element to this element
     *
     * @param {...CBS_NodeMap} elements
     */
    append(...elements: CBS_NodeMap): void;
    /**
     * Removes an element from this element
     *
     * @param {...CBS_NodeMap} elements
     */
    removeElement(...elements: CBS_NodeMap): void;
    /**
     * Appends an element at the start of this element
     *
     * @param {...CBS_NodeMap} elements
     */
    prepend(...elements: CBS_NodeMap): void;
    /**
     * Replace an element with another element
     *
     * @param {CBS_Node} nodeToReplace
     * @param {...CBS_NodeMap} elementsToAdd
     */
    replace(nodeToReplace: CBS_Node, ...elementsToAdd: CBS_NodeMap): void;
    /**
     * Inserts an element before another element
     *
     * @param {CBS_Node} nodeToInsertBefore
     * @param {...CBS_NodeMap} elementsToAdd
     */
    insertBefore(nodeToInsertBefore: CBS_Node, ...elementsToAdd: CBS_NodeMap): void;
    /**
     * Inserts an element after another element
     *
     * @param {CBS_Node} nodeToInsertAfter
     * @param {...CBS_NodeMap} elementsToAdd
     */
    insertAfter(nodeToInsertAfter: CBS_Node, ...elementsToAdd: CBS_NodeMap): void;
    /**
     * Description placeholder
     */
    clearElements(): void;
    /**
     * Gets the parent of this element
     *
     * @readonly
     * @type {(HTMLElement|null)}
     */
    get parent(): HTMLElement | null;
    /**
     * Creates all <span> and <div> to replace {{}} in the HTML
     */
    render(): void;
    /**
     * Writes a value to a parameter
     *
     * @param {string} key
     * @param {CBS_ParameterValue} value
     * @param {boolean} [trigger=true]
     */
    write(key: string, value: CBS_ParameterValue, trigger?: boolean): void;
    /**
     * Reads a parameter
     * @deprecated
     * I don't think this is useful at all
     *
     * @param {string} param
     * @param {boolean} [asHTML=false]
     * @returns {CBS_ParameterValue[]}
     */
    read(param: string, asHTML?: boolean): CBS_ParameterValue[];
    /**
     * Gets all parameters
     *
     * @type {CBS_Parameters}
     */
    get parameters(): CBS_Parameters;
    /**
     * Sets all parameters and writs them to the element
     *
     * @type {CBS_Parameters}
     */
    set parameters(params: CBS_Parameters);
    /**
     * Writes all parameters to the element
     */
    writeAll(): void;
    /**
     * Adds a listener to the element
     *
     * @param {string} event
     * @param {CBS_ListenerCallback} callback
     * @param {boolean} [isAsync=false]
     */
    on(event: string, callback: CBS_ListenerCallback, isAsync?: boolean): void;
    /**
     * If the element has a listener for the event
     *
     * @param {string} event
     * @returns {boolean}
     */
    hasListener(event: string): boolean;
    /**
     * Removes a listener from the element
     *
     * @param {?string} [event]
     * @param {?CBS_ListenerCallback} [callback]
     */
    off(event?: string, callback?: CBS_ListenerCallback): void;
    /**
     * Triggers an event on the element (same as dispatch event)
     *
     * @async
     * @param {string} event
     * @param {?EventInit} [options]
     * @returns {Promise<boolean>}
     */
    trigger(event: string, options?: EventInit): Promise<boolean>;
    /**
     * Hides the element (adds d-none class)
     */
    hide(): void;
    /**
     * Shows the element (removes d-none class)
     */
    show(): void;
    /**
     * Tests if the element is hidden (has the d-none class)
     */
    get isHidden(): boolean;
    /**
     * Toggles the d-none class
     */
    toggleHide(): void;
    /**
     * Description placeholder
     */
    destroy(): void;
    /**
     * Clones this
     * @param {Boolean} listeners Whether or not to clone all listeners (default: true)
     * @returns {CBS_Element} A clone of this
     */
    clone(listeners?: boolean): CBS_Element;
    /**
     * Description placeholder
     *
     * @param {...string[]} classes
     */
    addClass(...classes: string[]): void;
    /**
     * Description placeholder
     *
     * @param {...string[]} classes
     */
    removeClass(...classes: string[]): void;
    /**
     * Description placeholder
     *
     * @param {...string[]} classes
     */
    toggleClass(...classes: string[]): void;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {{}}
     */
    get classes(): string[];
    set classes(classes: string[]);
    clearClasses(): void;
    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {*}
     */
    hasClass(...name: string[]): any;
    get style(): object;
    set style(style: object);
    _attributes: {
        [key: string]: string;
    };
    /**
     * Description placeholder
     *
     * @param {string} name
     * @param {string} value
     */
    setAttribute(name: string, value: string): void;
    /**
     * Description placeholder
     *
     * @param {string} name
     */
    removeAttribute(name: string): void;
    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {string}
     */
    getAttribute(name: string): string;
    clearAttributes(): void;
    get attributes(): {
        [key: string]: string;
    };
    set attributes(attributes: {
        [key: string]: string;
    });
    /**
     * Description placeholder
     *
     * @param {(MouseEvent|TouchEvent)} e
     * @returns {{ x: number; y: number; }}
     */
    getXY(e: MouseEvent | TouchEvent): {
        x: number;
        y: number;
    };
    /**
     * Description placeholder
     *
     * @param {TouchEvent} e
     * @returns {*}
     */
    getXYList(e: TouchEvent): {
        x: number;
        y: number;
    }[];
    /**
     * Description placeholder
     *
     * @type {(CBS_Color|undefined)}
     */
    _background: CBS_Color | undefined;
    /**
     * Description placeholder
     *
     * @type {*}
     */
    set background(color: CBS_Color | undefined);
    /**
     * Description placeholder
     *
     * @type {(CBS_Color|undefined)}
     */
    get background(): CBS_Color | undefined;
    get html(): string;
    set html(text: string);
    get content(): CBS_Node | CBS_NodeMap;
    set content(content: CBS_Node | CBS_NodeMap);
}
/**
 * For Subcomponents
 *
 * @typedef {CBS_SubComponentContainer}
 */
type CBS_SubComponentContainer = {
    [key: string]: CBS_Element;
};
/**
 * Layer between larger components and their respective elements
 * I don't know if this is necessary, but it's here for now
 * This just makes it easier to differentiate if a class is a component or an element (has mulitple elements or is just one)
 *
 * @class CBS_Component
 * @typedef {CBS_Component}
 * @extends {CBS_Element}
 */
export class CBS_Component extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_Component.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options);
}
export class CBS_Document extends CBS_Component {
    constructor(options?: CBS_Options);
}
export enum CBS_Breakpoint {
    xs = 0,
    sm = 576,
    md = 768,
    lg = 992,
    xl = 1200,
    xxl = 1400
}
export enum CBS_Color {
    primary = "primary",
    secondary = "secondary",
    success = "success",
    danger = "danger",
    warning = "warning",
    info = "info",
    light = "light",
    dark = "dark",
    white = "white",
    transparent = "transparent"
}
export enum CBS_Size {
    xs = "xs",
    sm = "sm",
    md = "md",
    lg = "lg",
    xl = "xl",
    xxl = "xxl"
}
export enum CBS_Weight {
    normal = "normal",
    bold = "bold",
    bolder = "bolder",
    lighter = "lighter"
}
export enum CBS_Align {
    left = "left",
    center = "center",
    right = "right",
    justify = "justify"
}
/**
 * Description placeholder
 *
 * @typedef {CBS_ColOptions}
 */
type CBS_ColOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    breakpoints?: CBS_BreakpointMap;
};
/**
 * Description placeholder
 *
 * @typedef {CBS_BreakpointMap}
 */
type CBS_BreakpointMap = {
    [key: string]: number;
};
/**
 * Description placeholder
 *
 * @class CBS_Col
 * @typedef {CBS_Col}
 * @extends {CBS_Element}
 */
export class CBS_Col extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {{
            [key: string]: number;
        }}
     */
    private breakpoints;
    /**
     * Creates an instance of CBS_Col.
     *
     * @constructor
     * @param {?CBS_ColOptions} [options]
     */
    constructor(options?: CBS_ColOptions);
    /**
     * Description placeholder
     *
     * @param {string} breakpoint
     * @param {number} size
     */
    addBreakpoint(breakpoint: string, size: number): void;
    /**
     * Description placeholder
     *
     * @param {string} breakpoint
     */
    removeBreakpoint(breakpoint: string): void;
    set options(options: CBS_ColOptions);
    get options(): CBS_ColOptions;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_ContainerOptions}
 */
type CBS_ContainerOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    fluid?: boolean;
};
/**
 * Description placeholder
 *
 * @class CBS_Container
 * @typedef {CBS_Container}
 * @extends {CBS_Element}
 */
export class CBS_Container extends CBS_Element {
    /**
     * Creates an instance of CBS_Container.
     *
     * @constructor
     * @param {?CBS_ContainerOptions} [options]
     */
    constructor(options?: CBS_ContainerOptions);
    /**
     * Description placeholder
     *
     * @type {CBS_ContainerOptions}
     */
    set options(options: CBS_ContainerOptions);
    get options(): CBS_ContainerOptions;
    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    set fluid(fluid: boolean);
    /**
     * Description placeholder
     *
     * @returns {*}
     */
    addRow(options?: CBS_Options): CBS_Row;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_RowOptions}
 */
type CBS_RowOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_Row
 * @typedef {CBS_Row}
 * @extends {CBS_Element}
 */
export class CBS_Row extends CBS_Element {
    /**
     * Creates an instance of CBS_Row.
     *
     * @constructor
     * @param {?CBS_RowOptions} [options]
     */
    constructor(options?: CBS_RowOptions);
    /**
     * Description placeholder
     *
     * @param {?CBS_BreakpointMap} [breakpoints]
     * @returns {CBS_Col}
     */
    addCol(breakpoints?: CBS_BreakpointMap): CBS_Col;
    /**
     * Description placeholder
     *
     * @param {CBS_Col} col
     */
    removeCol(col: CBS_Col): void;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_TextOptions}
 */
type CBS_TextOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_Text
 * @typedef {CBS_Component}
 * @extends {CBS_Element}
 */
export class CBS_Text extends CBS_Element {
    __color?: CBS_Color;
    __size?: CBS_Size;
    __weight?: CBS_Weight;
    __align?: CBS_Align;
    /**
     * Creates an instance of CBS_Text.
     *
     * @constructor
     * @param {?CBS_TextOptions} [options]
     */
    constructor(options?: CBS_TextOptions);
    set text(text: string);
    get text(): string;
    set html(html: string);
    get html(): string;
    set color(color: CBS_Color | undefined);
    get color(): CBS_Color | undefined;
    set size(size: CBS_Size | undefined);
    get size(): CBS_Size | undefined;
    set weight(weight: CBS_Weight | undefined);
    get weight(): CBS_Weight | undefined;
    set align(align: CBS_Align | undefined);
    get align(): CBS_Align | undefined;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_AnchorOptions}
 */
type CBS_AnchorOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_Anchor
 * @typedef {CBS_Anchor}
 * @extends {CBS_Component}
 */
export class CBS_Anchor extends CBS_Component {
    /**
     * Creates an instance of CBS_Anchor.
     *
     * @constructor
     * @param {?CBS_AnchorOptions} [options]
     */
    constructor(options?: CBS_AnchorOptions);
}
/**
 * Description placeholder
 *
 * @typedef {CBS_HeadingOptions}
 */
type CBS_HeadingOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_Heading
 * @typedef {CBS_Heading}
 * @extends {CBS_Component}
 */
export class CBS_Heading extends CBS_Text {
    /**
     * Creates an instance of CBS_Heading.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions);
}
/**
 * Description placeholder
 *
 * @class CBS_H1
 * @typedef {CBS_H1}
 * @extends {CBS_Heading}
 */
export class CBS_H1 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H1.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions);
}
/**
 * Description placeholder
 *
 * @class CBS_H2
 * @typedef {CBS_H2}
 * @extends {CBS_Heading}
 */
export class CBS_H2 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H2.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions);
}
/**
 * Description placeholder
 *
 * @class CBS_H3
 * @typedef {CBS_H3}
 * @extends {CBS_Heading}
 */
export class CBS_H3 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H3.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions);
}
/**
 * Description placeholder
 *
 * @class CBS_H4
 * @typedef {CBS_H4}
 * @extends {CBS_Heading}
 */
export class CBS_H4 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H4.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions);
}
/**
 * Description placeholder
 *
 * @class CBS_H5
 * @typedef {CBS_H5}
 * @extends {CBS_Heading}
 */
export class CBS_H5 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H5.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions);
}
/**
 * Description placeholder
 *
 * @class CBS_H6
 * @typedef {CBS_H6}
 * @extends {CBS_Heading}
 */
export class CBS_H6 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H6.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions);
}
/**
 * Description placeholder
 *
 * @typedef {CBS_ParagraphOptions}
 */
type CBS_ParagraphOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_Paragraph
 * @typedef {CBS_Component}
 * @extends {CBS_Component}
 */
export class CBS_Paragraph extends CBS_Text {
    /**
     * Creates an instance of CBS_Paragraph.
     *
     * @constructor
     * @param {?CBS_ParagraphOptions} [options]
     */
    constructor(options?: CBS_ParagraphOptions);
}
export class CBS_Span extends CBS_Element {
    constructor(options?: CBS_TextOptions);
}
/**
 * Description placeholder
 *
 * @typedef {CBS_ButtonOptions}
 */
type CBS_ButtonOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    outlined?: boolean;
    rounded?: boolean;
    size?: CBS_Size;
    color?: string;
    shadow?: boolean;
};
/**
 * Description placeholder
 *
 * @class CBS_Button
 * @typedef {CBS_Button}
 * @extends {CBS_Component}
 */
export class CBS_Button extends CBS_Element {
    /**
     * Creates an instance of CBS_Button.
     *
     * @constructor
     * @param {?CBS_ButtonOptions} [options]
     */
    constructor(options?: CBS_ButtonOptions);
    /**
     * Description placeholder
     *
     * @type {CBS_ButtonOptions}
     */
    set options(options: CBS_ButtonOptions);
    get options(): CBS_ButtonOptions;
    /**
     * Description placeholder
     */
    disable(): void;
    /**
     * Description placeholder
     */
    enable(): void;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get enabled(): boolean;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get disabled(): boolean;
}
/**
 * Description placeholder
 *
 * @class CBS_CardHeader
 * @typedef {CBS_CardHeader}
 * @extends {CBS_Element}
 */
export class CBS_CardHeader extends CBS_Element {
    /**
     * Creates an instance of CBS_CardHeader.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options);
}
/**
 * Description placeholder
 *
 * @class CBS_CardBody
 * @typedef {CBS_CardBody}
 * @extends {CBS_Element}
 */
export class CBS_CardBody extends CBS_Element {
    /**
     * Creates an instance of CBS_CardBody.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options);
}
/**
 * Description placeholder
 *
 * @class CBS_CardFooter
 * @typedef {CBS_CardFooter}
 * @extends {CBS_Element}
 */
export class CBS_CardFooter extends CBS_Element {
    /**
     * Creates an instance of CBS_CardFooter.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options);
}
/**
 * Description placeholder
 *
 * @typedef {CBS_CardOptions}
 */
type CBS_CardOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_Card
 * @typedef {CBS_Card}
 * @extends {CBS_Component}
 */
export class CBS_Card extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_Card.
     *
     * @constructor
     * @param {?CBS_CardOptions} [options]
     */
    constructor(options?: CBS_CardOptions);
}
/**
 * Description placeholder
 *
 * @typedef {CBS_ModalOptions}
 */
type CBS_ModalOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    buttons?: CBS_Button[];
};
/**
 * Description placeholder
 *
 * @class CBS_ModalTitle
 * @typedef {CBS_ModalHeader}
 * @extends {CBS_Element}
 */
export class CBS_ModalHeader extends CBS_Component {
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_ModalTitle.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options);
    get text(): string | null;
    set text(text: string | null);
}
/**
 * Description placeholder
 *
 * @class CBS_ModalBody
 * @typedef {CBS_ModalBody}
 * @extends {CBS_Element}
 */
export class CBS_ModalBody extends CBS_Element {
    /**
     * Creates an instance of CBS_ModalBody.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options);
}
/**
 * Description placeholder
 *
 * @class CBS_ModalFooter
 * @typedef {CBS_ModalFooter}
 * @extends {CBS_Element}
 */
export class CBS_ModalFooter extends CBS_Element {
    /**
     * Creates an instance of CBS_ModalFooter.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options);
}
/**
 * Description placeholder
 *
 * @class CBS_ModalDialog
 * @typedef {CBS_ModalDialog}
 * @extends {CBS_Component}
 */
export class CBS_ModalDialog extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_ModalDialog.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options);
}
export class CBS_ModalContent extends CBS_Component {
    subcomponents: CBS_ElementContainer;
    constructor(options?: CBS_Options);
}
/**
 * Description placeholder
 *
 * @class CBS_Modal
 * @typedef {CBS_Modal}
 * @extends {CBS_Component}
 */
export class CBS_Modal extends CBS_Component {
    /**
     * Creates an instance of CBS_Modal.
     *
     * @constructor
     * @param {?CBS_ModalOptions} [options]
     */
    constructor(options?: CBS_ModalOptions);
    get title(): string;
    set title(title: string);
    get body(): CBS_Element;
    set body(body: CBS_Element);
    get footer(): CBS_Element;
    set footer(footer: CBS_Element);
    /**
     * Description placeholder
     *
     * @type {CBS_ModalOptions}
     */
    set options(options: CBS_ModalOptions);
    get options(): CBS_ModalOptions;
    /**
     * Description placeholder
     */
    show(): void;
    /**
     * Description placeholder
     */
    hide(): void;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_ProgressBarOptions}
 */
type CBS_ProgressBarOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_ProgressBar
 * @typedef {CBS_ProgressBar}
 * @extends {CBS_Component}
 */
export class CBS_ProgressBar extends CBS_Component {
    /**
     * Creates an instance of CBS_ProgressBar.
     *
     * @constructor
     * @param {?CBS_ProgressBarOptions} [options]
     */
    constructor(options?: CBS_ProgressBarOptions);
}
/**
 * Description placeholder
 *
 * @class CBS_Progress
 * @typedef {CBS_Progress}
 * @extends {CBS_Component}
 */
export class CBS_Progress extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_Progress.
     *
     * @constructor
     * @param {?CBS_ProgressBarOptions} [options]
     */
    constructor(options?: CBS_ProgressBarOptions);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set progress(progress: number);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get progress(): number;
    /**
     * Description placeholder
     */
    destroy(): void;
}
type CBS_TableOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    responsive?: boolean;
};
export class CBS_TableBody extends CBS_Element {
    constructor(options?: CBS_Options);
    addRow(options?: CBS_Options): CBS_TableRow;
}
export class CBS_TableData extends CBS_Element {
    constructor(options?: CBS_Options);
}
export class CBS_TableHeader extends CBS_Element {
    constructor(options?: CBS_Options);
}
export class CBS_TableHead extends CBS_Element {
    constructor(options?: CBS_Options);
    addRow(options?: CBS_Options): CBS_TableHeadRow;
}
export class CBS_TableFoot extends CBS_TableHead {
    constructor(options?: CBS_Options);
    addRow(options?: CBS_Options): CBS_TableFootRow;
}
export class CBS_TableRow extends CBS_Element {
    constructor(options?: CBS_Options);
    addData(options?: CBS_Options): CBS_TableData;
}
export class CBS_TableHeadRow extends CBS_Element {
    constructor(options?: CBS_Options);
    addHeader(options?: CBS_Options): CBS_TableHeader;
}
export class CBS_TableFootRow extends CBS_TableHeadRow {
    constructor(options?: CBS_Options);
}
export class CBS_TableCaption extends CBS_Text {
    constructor(options?: CBS_Options);
}
export class CBS_SubTable extends CBS_Element {
    constructor(options?: CBS_Options);
}
export class CBS_Table extends CBS_Component {
    static from(table: HTMLTableElement): void;
    subcomponents: CBS_ElementContainer;
    constructor(options?: CBS_TableOptions);
    addBody(options?: CBS_Options): CBS_TableBody;
    addHead(options?: CBS_Options): CBS_TableHead;
    addFoot(options?: CBS_Options): CBS_TableFoot;
    addCaption(options?: CBS_Options): CBS_TableCaption;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_FormOptions}
 */
type CBS_FormOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @typedef {CBS_InputList}
 */
type CBS_InputList = {
    [key: string]: CBS_Input | CBS_InputLabelContainer;
};
/**
 * Description placeholder
 *
 * @class CBS_Form
 * @typedef {CBS_Form}
 * @extends {CBS_Component}
 */
export class CBS_Form extends CBS_Component {
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_Form.
     *
     * @constructor
     * @param {?CBS_FormOptions} [options]
     */
    constructor(options?: CBS_FormOptions);
    /**
     * Description placeholder
     *
     * @param {string} type
     * @param {CBS_Options} options
     * @returns {CBS_Input}
     */
    createInput(name: string, type: string, options?: CBS_Options): CBS_InputLabelContainer;
    get inputs(): CBS_InputList;
    get value(): {
        [key: string]: any;
    };
    get mirrorValue(): {
        [key: string]: any;
    };
    append(...elements: CBS_Node[]): void;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_InputOptions}
 */
type CBS_InputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    name?: string;
    label?: string;
    value?: string;
    group?: boolean;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
};
/**
 * Description placeholder
 *
 * @interface CBS_InputInterface
 * @typedef {CBS_InputInterface}
 */
interface CBS_InputInterface {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    value: string;
    /**
     * Description placeholder
     *
     * @type {HTMLElement}
     */
    el: HTMLElement;
    /**
     * Description placeholder
     *
     * @type {CBS_InputOptions}
     */
    options: CBS_InputOptions;
    /**
     * Description placeholder
     *
     * @type {?*}
     */
    mirrorValue?: any;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_InputMirrorValueMap}
 */
type CBS_InputMirrorValueMap = {
    [key: string]: any;
};
/**
 * Description placeholder
 *
 * @class CBS_Input
 * @typedef {CBS_Input}
 * @extends {CBS_Element}
 * @implements {CBS_InputInterface}
 */
export class CBS_Input extends CBS_Component implements CBS_InputInterface {
    /**
     * Description placeholder
     *
     * @type {CBS_InputMirrorValueMap}
     */
    mirrorValues: CBS_InputMirrorValueMap;
    /**
     * Description placeholder
     *
     * @type {?(value: any) => any}
     */
    getMirrorValue?: (value: any) => any;
    /**
     * Description placeholder
     *
     * @type {HTMLInputElement}
     */
    _el: HTMLInputElement;
    /**
     * Creates an instance of CBS_Input.
     *
     * @constructor
     * @param {?CBS_InputOptions} [options]
     */
    constructor(options?: CBS_InputOptions);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get value(): any;
    set value(value: any);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any;
    /**
     * Description placeholder
     *
     * @param {(value: string) => any} fn
     * @returns {any) => void}
     */
    setMirrorValueGetter(fn: (value: string) => any): void;
    /**
     * Description placeholder
     *
     * @param {string} name
     * @param {*} value
     */
    addMirrorValue(name: string, value: any): void;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_LabelOptions}
 */
type CBS_LabelOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    name?: string;
};
/**
 * Description placeholder
 *
 * @class CBS_Label
 * @typedef {CBS_Label}
 * @extends {CBS_Element}
 */
export class CBS_Label extends CBS_Element {
    #private;
    /**
     * Creates an instance of CBS_Label.
     *
     * @constructor
     * @param {?CBS_InputOptions} [options]
     */
    constructor(options?: CBS_InputOptions);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text: string);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text(): string;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_InputGroupOptions}
 */
type CBS_InputGroupOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    type?: string;
};
/**
 * Description placeholder
 *
 * @class CBS_InputGroupLabel
 * @typedef {CBS_InputGroupLabel}
 * @extends {CBS_Element}
 */
export class CBS_InputGroupLabel extends CBS_Element {
    #private;
    /**
     * Creates an instance of CBS_InputGroupLabel.
     *
     * @constructor
     * @param {?CBS_InputGroupOptions} [options]
     */
    constructor(options?: CBS_InputGroupOptions);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text: string);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text(): string;
}
/**
 * Description placeholder
 *
 * @class CBS_InputGroup
 * @typedef {CBS_InputGroup}
 * @extends {CBS_Component}
 */
export class CBS_InputGroup extends CBS_Component {
    /**
     * Creates an instance of CBS_InputGroup.
     *
     * @constructor
     * @param {?CBS_InputGroupOptions} [options]
     */
    constructor(options?: CBS_InputGroupOptions);
    /**
     * Description placeholder
     *
     * @param {string} label
     */
    addGroupLabel(label: string): void;
    /**
     * Description placeholder
     *
     * @param {(CBS_Input|CBS_InputLabelContainer)} input
     */
    addInput(input: CBS_Input | CBS_InputLabelContainer): void;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_InputLabelContainerOptions}
 */
type CBS_InputLabelContainerOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    type?: string;
};
/**
 * Description placeholder
 *
 * @class CBS_InputLabelContainer
 * @typedef {CBS_InputLabelContainer}
 * @extends {CBS_Component}
 * @implements {CBS_InputInterface}
 */
export class CBS_InputLabelContainer extends CBS_Component implements CBS_InputInterface {
    #private;
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_InputLabelContainer.
     *
     * @constructor
     * @param {CBS_Input} input
     * @param {CBS_Label} label
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options);
    /**
     * Description placeholder
     *
     * @type {CBS_Input}
     */
    set input(input: CBS_Input);
    get input(): CBS_Input;
    /**
     * Description placeholder
     *
     * @type {*}
     */
    set label(label: CBS_Label);
    get label(): CBS_Label;
    set type(type: string);
    get type(): string;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get value(): any;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get formText(): string;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set formText(content: string);
}
/**
 * Description placeholder
 *
 * @typedef {CBS_CheckboxOptions}
 */
type CBS_CheckboxOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    label?: string;
    mirrorValue?: any;
};
/**
 * Description placeholder
 *
 * @class CBS_CheckboxLabel
 * @typedef {CBS_CheckboxLabel}
 * @extends {CBS_Element}
 */
export class CBS_CheckboxLabel extends CBS_Element {
    #private;
    /**
     * Creates an instance of CBS_CheckboxLabel.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options?: CBS_CheckboxOptions);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text: string);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text(): string;
}
/**
 * Description placeholder
 *
 * @class CBS_CheckboxInput
 * @typedef {CBS_CheckboxInput}
 * @extends {CBS_Input}
 */
export class CBS_CheckboxInput extends CBS_Input {
    #private;
    /**
     * Creates an instance of CBS_CheckboxInput.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options?: CBS_CheckboxOptions);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get value(): boolean;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any;
    /**
     * Description placeholder
     */
    select(): void;
    /**
     * Description placeholder
     */
    deselect(): void;
    /**
     * Description placeholder
     */
    toggle(): void;
    /**
     * Description placeholder
     */
    disable(): void;
    /**
     * Description placeholder
     */
    enable(): void;
    /**
     * Description placeholder
     */
    semiCheck(): void;
}
/**
 * Description placeholder
 *
 * @class CBS_Checkbox
 * @typedef {CBS_Checkbox}
 * @extends {CBS_Input}
 */
export class CBS_Checkbox extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_Checkbox.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options?: CBS_CheckboxOptions);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text: string);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text(): string;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get value(): boolean;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any;
    /**
     * Description placeholder
     */
    select(): void;
    /**
     * Description placeholder
     */
    deselect(): void;
    /**
     * Description placeholder
     */
    toggle(): void;
    /**
     * Description placeholder
     */
    disable(): void;
    /**
     * Description placeholder
     */
    enable(): void;
    /**
     * Description placeholder
     */
    semiCheck(): void;
}
/**
 * Description placeholder
 *
 * @class CBS_CheckboxGroup
 * @typedef {CBS_CheckboxGroup}
 * @extends {CBS_Component}
 */
export class CBS_CheckboxGroup extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_Checkbox[]}
     */
    checkboxes: CBS_Checkbox[];
    /**
     * Creates an instance of CBS_CheckboxGroup.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options?: CBS_CheckboxOptions);
    /**
     * Description placeholder
     *
     * @param {string} value
     * @param {?CBS_CheckboxOptions} [options]
     * @returns {CBS_Checkbox}
     */
    addCheckbox(value: string, options?: CBS_CheckboxOptions): CBS_Checkbox;
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    removeCheckbox(value: string): boolean;
    /**
     * Description placeholder
     */
    clearCheckboxes(): void;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get value(): any;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any;
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    select(value: string): boolean | undefined;
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    isSelected(value: string): boolean | undefined;
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    deselect(value: string): boolean | undefined;
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    toggle(value: string): boolean | undefined;
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    disable(value: string): boolean | undefined;
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    semiCheck(value: string): boolean | undefined;
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {(boolean|undefined)}
     */
    enable(value: string): boolean | undefined;
    /**
     * Description placeholder
     */
    selectAll(): void;
    /**
     * Description placeholder
     */
    deselectAll(): void;
    /**
     * Description placeholder
     */
    toggleAll(): void;
    /**
     * Description placeholder
     */
    disableAll(): void;
    /**
     * Description placeholder
     */
    enableAll(): void;
    /**
     * Description placeholder
     */
    semiCheckAll(): void;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_ColorInputOptions}
 */
type CBS_ColorInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_ColorInput
 * @typedef {CBS_ColorInput}
 * @extends {CBS_Input}
 */
export class CBS_ColorInput extends CBS_Input {
    /**
     * Creates an instance of CBS_ColorInput.
     *
     * @constructor
     * @param {?CBS_ColorInputOptions} [options]
     */
    constructor(options?: CBS_ColorInputOptions);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value(): string;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value: string);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_DateInputOptions}
 */
type CBS_DateInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_DateInput
 * @typedef {CBS_DateInput}
 * @extends {CBS_Input}
 */
export class CBS_DateInput extends CBS_Input {
    /**
     * Creates an instance of CBS_DateInput.
     *
     * @constructor
     * @param {?CBS_DateInputOptions} [options]
     */
    constructor(options?: CBS_DateInputOptions);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value(): string;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value: string);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {Date}
     */
    get mirrorValue(): Date;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_EmailInputOptions}
 */
type CBS_EmailInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_EmailInput
 * @typedef {CBS_EmailInput}
 * @extends {CBS_Input}
 */
export class CBS_EmailInput extends CBS_Input {
    /**
     * Creates an instance of CBS_EmailInput.
     *
     * @constructor
     * @param {?CBS_EmailInputOptions} [options]
     */
    constructor(options?: CBS_EmailInputOptions);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value(): string;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value: string);
    /**
     * Description placeholder
     *
     * @async
     * @returns {unknown}
     */
    isValid(): Promise<boolean>;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {any}
     */
    get mirrorValue(): any;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_FileInputOptions}
 */
type CBS_FileInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_FileInput
 * @typedef {CBS_FileInput}
 * @extends {CBS_Input}
 */
export class CBS_FileInput extends CBS_Input {
    /**
     * Creates an instance of CBS_FileInput.
     *
     * @constructor
     * @param {?CBS_FileInputOptions} [options]
     */
    constructor(options?: CBS_FileInputOptions);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {FileList}
     */
    get value(): FileList;
    /**
     * Description placeholder
     */
    clearFiles(): void;
    /**
     * Description placeholder
     *
     * @async
     * @returns {Promise<ReadableStream[]>}
     */
    getFileStreams(): Promise<ReadableStream[]>;
}
/**
 * Description placeholder
 *
 * @class CBS_FormText
 * @typedef {CBS_FormText}
 * @extends {CBS_Element}
 */
export class CBS_FormText extends CBS_Element {
    /**
     * Creates an instance of CBS_FormText.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set content(content: string);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get content(): string;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_NumberInputOptions}
 */
type CBS_NumberInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_NumberInput
 * @typedef {CBS_NumberInput}
 * @extends {CBS_Input}
 */
export class CBS_NumberInput extends CBS_Input {
    /**
     * Creates an instance of CBS_NumberInput.
     *
     * @constructor
     * @param {?CBS_NumberInputOptions} [options]
     */
    constructor(options?: CBS_NumberInputOptions);
    get value(): number;
    set value(value: number);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {any}
     */
    get mirrorValue(): any;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_PasswordInputOptions}
 */
type CBS_PasswordInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_PasswordInput
 * @typedef {CBS_PasswordInput}
 * @extends {CBS_Input}
 */
export class CBS_PasswordInput extends CBS_Input {
    /**
     * Creates an instance of CBS_PasswordInput.
     *
     * @constructor
     * @param {?CBS_PasswordInputOptions} [options]
     */
    constructor(options?: CBS_PasswordInputOptions);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value(): string;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value: string);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {any}
     */
    get mirrorValue(): any;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_RadioOptions}
 */
type CBS_RadioOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    mirrorValue?: any;
    label?: string;
};
export class CBS_RadioLabel extends CBS_CheckboxLabel {
    /**
     * Creates an instance of CBS_RadioLabel.
     *
     * @constructor
     * @param {?CBS_RadioOptions} [options]
     */
    constructor(options?: CBS_RadioOptions);
}
/**
 * Description placeholder
 *
 * @class CBS_RadioInput
 * @typedef {CBS_RadioInput}
 * @extends {CBS_Input}
 */
export class CBS_RadioInput extends CBS_Input {
    /**
     * Creates an instance of CBS_RadioInput.
     *
     * @constructor
     * @param {?CBS_RadioOptions} [options]
     */
    constructor(options?: CBS_RadioOptions);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get value(): boolean;
    /**
     * Description placeholder
     */
    select(): void;
    /**
     * Description placeholder
     */
    deselect(): void;
    /**
     * Description placeholder
     */
    disable(): void;
    /**
     * Description placeholder
     */
    enable(): void;
}
/**
 * Description placeholder
 *
 * @class CBS_Radio
 * @typedef {CBS_Radio}
 * @extends {CBS_Input}
 */
export class CBS_Radio extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_Radio.
     *
     * @constructor
     * @param {?CBS_RadioOptions} [options]
     */
    constructor(options?: CBS_RadioOptions);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text: string);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get text(): string;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get value(): boolean;
    /**
     * Description placeholder
     */
    select(): void;
    /**
     * Description placeholder
     */
    deselect(): void;
    /**
     * Description placeholder
     */
    disable(): void;
    /**
     * Description placeholder
     */
    enable(): void;
}
/**
 * Description placeholder
 *
 * @class CBS_RadioGroup
 * @typedef {CBS_RadioGroup}
 * @extends {CBS_Input}
 */
export class CBS_RadioGroup extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_Radio[]}
     */
    radios: CBS_Radio[];
    /**
     * Creates an instance of CBS_RadioGroup.
     *
     * @constructor
     * @param {?CBS_RadioOptions} [options]
     */
    constructor(options?: CBS_RadioOptions);
    /**
     * Description placeholder
     *
     * @param {string} value
     * @param {?CBS_RadioOptions} [options]
     * @returns {CBS_Radio}
     */
    addRadio(value: string, options?: CBS_RadioOptions): CBS_Radio;
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    removeRadio(value: string): boolean;
    /**
     * Description placeholder
     */
    clearRadios(): void;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {string}
     */
    get value(): string;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any;
    /**
     * Description placeholder
     */
    deselectAll(): void;
    /**
     * Description placeholder
     */
    disableAll(): void;
    /**
     * Description placeholder
     */
    enableAll(): void;
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    select(value: string): boolean;
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    disable(value: string): boolean;
    /**
     * Description placeholder
     *
     * @param {string} value
     * @returns {boolean}
     */
    enable(value: string): boolean;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_RangeInputOptions}
 */
type CBS_RangeInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    min?: number;
    max?: number;
    step?: number;
};
/**
 * Description placeholder
 *
 * @class CBS_RangeInput
 * @typedef {CBS_RangeInput}
 * @extends {CBS_Input}
 */
export class CBS_RangeInput extends CBS_Input {
    /**
     * Creates an instance of CBS_RangeInput.
     *
     * @constructor
     * @param {?CBS_RangeInputOptions} [options]
     */
    constructor(options?: CBS_RangeInputOptions);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get value(): number;
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set value(value: number);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any;
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get min(): number;
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set min(min: number);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get max(): number;
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set max(max: number);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get step(): number;
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set step(step: number);
}
/**
 * Description placeholder
 *
 * @typedef {CBS_SelectOptions}
 */
type CBS_SelectOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_SelectOption
 * @typedef {CBS_SelectOption}
 * @extends {CBS_Element}
 */
export class CBS_SelectOption extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    value: string;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    text: string;
    /**
     * Description placeholder
     *
     * @type {*}
     */
    mirrorValue: any;
    /**
     * Creates an instance of CBS_SelectOption.
     *
     * @constructor
     * @param {string} text
     * @param {string} value
     * @param {*} [mirrorValue=null]
     */
    constructor(text: string, value: string, mirrorValue?: any);
    /**
     * Description placeholder
     */
    select(): void;
    /**
     * Description placeholder
     */
    deselect(): void;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {string}
     */
    get selected(): string;
    /**
     * Description placeholder
     */
    disable(): void;
    /**
     * Description placeholder
     */
    enable(): void;
}
/**
 * Description placeholder
 *
 * @class CBS_SelectInput
 * @typedef {CBS_SelectInput}
 * @extends {CBS_Input}
 */
export class CBS_SelectInput extends CBS_Input {
    /**
     * Description placeholder
     *
     * @type {CBS_SelectOption[]}
     */
    selectOptions: CBS_SelectOption[];
    /**
     * Creates an instance of CBS_SelectInput.
     *
     * @constructor
     * @param {?CBS_SelectOptions} [options]
     */
    constructor(options?: CBS_SelectOptions);
    /**
     * Description placeholder
     *
     * @param {string} text
     * @param {string} value
     * @param {*} [mirrorValue=null]
     * @returns {(CBS_SelectOption|null)}
     */
    addOption(text: string, value: string, mirrorValue?: any): CBS_SelectOption | null;
    /**
     * Description placeholder
     *
     * @param {(string|CBS_SelectOption)} valueOrOption
     */
    removeOption(valueOrOption: string | CBS_SelectOption): void;
    /**
     * Description placeholder
     *
     * @param {string} value
     */
    select(value: string): void;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {string}
     */
    get value(): string;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_TextInputOptions}
 */
type CBS_TextInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    name?: string;
    label?: string;
    value?: string;
    group?: boolean;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    datalist?: string;
};
/**
 * Description placeholder
 *
 * @class CBS_TextInput
 * @typedef {CBS_TextInput}
 * @extends {CBS_Input}
 */
export class CBS_TextInput extends CBS_Input {
    /**
     * Creates an instance of CBS_TextInput.
     *
     * @constructor
     * @param {?CBS_TextInputOptions} [options]
     */
    constructor(options?: CBS_TextInputOptions);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value(): string;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value: string);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_TextareaOptions}
 */
type CBS_TextareaOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Description placeholder
 *
 * @class CBS_TextAreaInput
 * @typedef {CBS_TextareaInput}
 * @extends {CBS_Input}
 */
export class CBS_TextareaInput extends CBS_Input {
    /**
     * Creates an instance of CBS_TextAreaInput.
     *
     * @constructor
     * @param {?CBS_TextareaOptions} [options]
     */
    constructor(options?: CBS_TextareaOptions);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value(): string;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value: string);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get columns(): number;
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set columns(value: number);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get rows(): number;
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set rows(value: number);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {any}
     */
    get mirrorValue(): any;
}
/**
 * Options for CBS_ListItem
 *
 * @typedef {CBS_ListItemOptions}
 */
type CBS_ListItemOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
/**
 * Item for CBS_List
 *
 * @class CBS_ListItem
 * @typedef {CBS_ListItem}
 * @extends {CBS_Component}
 */
export class CBS_ListItem extends CBS_Component {
    /**
     * Creates an instance of CBS_ListItem
     *
     * @constructor
     * @param {?CBS_ListItemOptions} [options]
     */
    constructor(options?: CBS_ListItemOptions);
}
/**
 * Options for the CBS_List component
 *
 * @typedef {CBS_ListOptions}
 */
type CBS_ListOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    ordered?: boolean;
};
/**
 * <ul> or <ol> element as a component
 *
 * @class CBS_List
 * @typedef {CBS_List}
 * @extends {CBS_Component}
 */
export class CBS_List extends CBS_Component {
    /**
     * Creates an instance of CBS_List
     *
     * @constructor
     * @param {?CBS_ListOptions} [options]
     */
    constructor(options?: CBS_ListOptions);
    /**
     * Sets the options for the CBS_List component
     * Calls the super method and then sets the element to either an <ol> or <ul> element
     *
     * @type {CBS_ListOptions}
     */
    set options(options: CBS_ListOptions);
    get options(): CBS_ListOptions;
    /**
     * Changes element to an <ol> element or <ul> element
     *
     * @type {boolean}
     */
    set ordered(ordered: boolean);
    /**
     * Returns whether the element is an <ol> element or <ul> element
     *
     * @type {boolean}
     */
    get ordered(): boolean;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_AudioOptions}
 */
type CBS_AudioOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    fadeTime?: number;
};
/**
 * Description placeholder
 *
 * @class CBS_AudioSource
 * @typedef {CBS_AudioSource}
 * @extends {CBS_Element}
 */
export class CBS_AudioSource extends CBS_Element {
    /**
     * Creates an instance of CBS_AudioSource.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set src(src: string);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get src(): string;
}
/**
 * Description placeholder
 *
 * @class CBS_AudioElement
 * @typedef {CBS_AudioElement}
 * @extends {CBS_Component}
 */
export class CBS_AudioElement extends CBS_Component {
    #private;
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_AudioElement.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {number}
     */
    get fadeTime(): number;
    /**
     * Description placeholder
     *
     * @async
     * @returns {*}
     */
    play(): Promise<void>;
    /**
     * Description placeholder
     *
     * @async
     * @returns {*}
     */
    pause(): Promise<void>;
    /**
     * Description placeholder
     *
     * @async
     * @returns {*}
     */
    stop(): Promise<void>;
    /**
     * Description placeholder
     *
     * @async
     * @param {number} duration
     * @returns {Promise<void>}
     */
    fadeIn(duration: number): Promise<void>;
    /**
     * Description placeholder
     *
     * @async
     * @param {number} duration
     * @returns {Promise<void>}
     */
    fadeOut(duration: number): Promise<void>;
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set volume(volume: number);
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get volume(): number;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set src(src: string);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get src(): string;
    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    set controls(controls: boolean);
    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    get controls(): boolean;
    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    set autoplay(autoplay: boolean);
    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    get autoplay(): boolean;
    /**
     * Description placeholder
     *
     * @readonly
     * @type {Promise<number>}
     */
    get duration(): Promise<number>;
    /**
     * Description placeholder
     *
     * @type {number}
     */
    get currentTime(): number;
    /**
     * Description placeholder
     *
     * @type {number}
     */
    set currentTime(currentTime: number);
    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get paused(): boolean;
}
/**
 * Description placeholder
 *
 * @class CBS_AudioPlayhead
 * @typedef {CBS_AudioPlayhead}
 * @extends {CBS_Element}
 */
export class CBS_AudioPlayhead extends CBS_Element {
    /**
     * Creates an instance of CBS_AudioPlayhead.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions);
}
/**
 * Description placeholder
 *
 * @class CBS_AudioTimeline
 * @typedef {CBS_AudioTimeline}
 * @extends {CBS_Component}
 */
export class CBS_AudioTimeline extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_AudioTimeline.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions);
    /**
     * Description placeholder
     *
     * @async
     * @param {CBS_AudioElement} audio
     * @returns {*}
     */
    update(audio: CBS_AudioElement): Promise<void>;
    /**
     * Description placeholder
     *
     * @param {number} clientX
     * @returns {number}
     */
    getProgress(clientX: number): number;
}
/**
 * Description placeholder
 *
 * @class CBS_AudioButton
 * @typedef {CBS_AudioButton}
 * @extends {CBS_Element}
 */
export class CBS_AudioButton extends CBS_Component {
    /**
     * Creates an instance of CBS_AudioButton.
     *
     * @constructor
     * @param {string} type
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(type: string, options?: CBS_AudioOptions);
}
/**
 * Description placeholder
 *
 * @class CBS_AudioPlayer
 * @typedef {CBS_AudioPlayer}
 * @extends {CBS_Component}
 */
export class CBS_AudioPlayer extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_AudioPlayer.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions);
}
/**
 * Description placeholder
 *
 * @class CBS_AudioCardBody
 * @typedef {CBS_AudioCardBody}
 * @extends {CBS_CardBody}
 */
export class CBS_AudioCardBody extends CBS_CardBody {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_AudioCardBody.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions);
}
/**
 * Description placeholder
 *
 * @class CBS_AudioCard
 * @typedef {CBS_AudioCard}
 * @extends {CBS_Card}
 */
export class CBS_AudioCard extends CBS_Card {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_AudioCard.
     *
     * @constructor
     * @param {?CBS_AudioOptions} [options]
     */
    constructor(options?: CBS_AudioOptions);
}
/**
 * Description placeholder
 *
 * @typedef {CBS_ImageOptions}
 */
type CBS_ImageOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
    src?: string;
};
/**
 * Description placeholder
 *
 * @class CBS_Image
 * @typedef {CBS_Image}
 * @extends {CBS_Component}
 */
export class CBS_Image extends CBS_Component {
    /**
     * Creates an instance of CBS_Image.
     *
     * @constructor
     * @param {?CBS_ImageOptions} [options]
     */
    constructor(options?: CBS_ImageOptions);
    /**
     * Description placeholder
     *
     * @type {CBS_ImageOptions}
     */
    set options(options: CBS_ImageOptions);
    get options(): CBS_ImageOptions;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set src(src: string);
}
type CBS_VideoOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    };
};
export class CBS_Video extends CBS_Component {
    constructor(options?: CBS_VideoOptions);
}
/**
 * Description placeholder
 *
 * @class CBS_ContextMenuItem
 * @typedef {CBS_ContextMenuItem}
 * @extends {CBS_Paragraph}
 */
export class CBS_ContextMenuItem extends CBS_Paragraph {
    /**
     * Creates an instance of CBS_ContextMenuItem.
     *
     * @constructor
     * @param {CBS_ContextmenuSelectOptions} options
     * @param {() => void} callback
     */
    constructor(options: CBS_ContextmenuSelectOptions, callback: () => void);
}
/**
 * Description placeholder
 *
 * @typedef {CBS_ContextmenuSections}
 */
type CBS_ContextmenuSections = {
    [key: string]: CBS_ContextmenuSection;
};
/**
 * Description placeholder
 *
 * @class CBS_ContextmenuSection
 * @typedef {CBS_ContextmenuSection}
 * @extends {CBS_Component}
 */
export class CBS_ContextmenuSection extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ContextMenuItem[]}
     */
    items: CBS_ContextMenuItem[];
    /**
     * Description placeholder
     *
     * @type {?CBS_Color}
     */
    color?: CBS_Color;
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_ContextmenuSection.
     *
     * @constructor
     * @param {CBS_ContextmenuSelectOptions} options
     */
    constructor(options: CBS_ContextmenuSelectOptions);
    /**
     * Description placeholder
     *
     * @param {string} name
     * @param {() => void} callback
     * @returns {CBS_ContextMenuItem}
     */
    addItem(name: string, callback: () => void): CBS_ContextMenuItem;
    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {boolean}
     */
    removeItem(name: string): boolean;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set name(name: string);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get name(): string;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_ContextmenuSelectOptions}
 */
type CBS_ContextmenuSelectOptions = {
    color?: CBS_Color;
    name: string;
};
/**
 * Description placeholder
 *
 * @typedef {CBS_ContextmenuOptions}
 */
type CBS_ContextmenuOptions = {
    /**
     * Classes to be added to the element
     *
     * @type {?string[]}
     */
    classes?: string[];
    /**
     * Id to be added to the element
     *
     * @type {?string}
     */
    id?: string;
    /**
     * Style to be added to the element
     *
     * @type {?object}
     */
    style?: object;
    /**
     * Attributes to be added to the element
     *
     * @type {?object}
     */
    attributes?: {
        [key: string]: string;
    };
    color?: CBS_Color;
    ignoreList?: string[];
};
export class CBS_SubContextmenu extends CBS_Component {
    constructor(options?: CBS_ContextmenuOptions);
    /**
     * Description placeholder
     *
     * @type {?CBS_Color}
     */
    color?: CBS_Color;
    /**
     * Description placeholder
     *
     * @type {CBS_ContextmenuOptions}
     */
    set options(options: CBS_ContextmenuOptions);
    get options(): CBS_ContextmenuOptions;
}
/**
 * Description placeholder
 *
 * @class CBS_Contextmenu
 * @typedef {CBS_Contextmenu}
 * @extends {CBS_Component}
 */
export class CBS_Contextmenu extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ContextmenuSections}
     */
    sections: CBS_ContextmenuSections;
    /**
     * Description placeholder
     *
     * @type {?(CBS_Element|HTMLElement)}
     */
    actionElement?: CBS_Element | HTMLElement;
    ignoreList: string[];
    subcomponents: CBS_ElementContainer;
    /**
     * Creates an instance of CBS_Contextmenu.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_ContextmenuOptions);
    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {CBS_ContextmenuSection}
     */
    addSection(name: string): CBS_ContextmenuSection;
    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {boolean}
     */
    removeSection(name: string): boolean;
    /**
     * Description placeholder
     *
     * @param {(CBS_Element|HTMLElement)} element
     */
    apply(element: CBS_Element | HTMLElement): void;
    /**
     * Description placeholder
     *
     * @private
     * @param {Event} e
     */
    private _show;
    private _hide;
}
/**
 * Description placeholder
 *
 * @typedef {CBS_ListenerCallback}
 */
type CBS_ListenerCallback = (event: Event) => Promise<boolean | void> | void;
/**
 * Description placeholder
 *
 * @class CBS_Listener
 * @typedef {CBS_Listener}
 */
export class CBS_Listener {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    event: string;
    /**
     * Description placeholder
     *
     * @type {CBS_ListenerCallback}
     */
    callback: CBS_ListenerCallback;
    /**
     * Description placeholder
     *
     * @type {boolean}
     */
    isAsync: boolean;
    /**
     * Creates an instance of CBS_Listener.
     *
     * @constructor
     * @param {string} event
     * @param {CBS_ListenerCallback} callback
     * @param {boolean} [isAsync=true]
     */
    constructor(event: string, callback: CBS_ListenerCallback, isAsync?: boolean);
}
/**
 * Description placeholder
 *
 * @typedef {CBS_Event}
 */
type CBS_Event = {
    event: string;
    callback: CBS_ListenerCallback;
    isAsync: boolean;
};
/**
 * Description placeholder
 *
 * @typedef {CBS_MaterialIconFontSettings}
 */
type CBS_MaterialIconFontSettings = {
    [key: string]: string | number;
};
/**
 * Description placeholder
 *
 * @class CBS_MaterialIcon
 * @typedef {CBS_MaterialIcon}
 * @extends {CBS_Component}
 */
export class CBS_MaterialIcon extends CBS_Component {
    /**
     * Creates an instance of CBS_MaterialIcon.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options);
    /**
     * Description placeholder
     *
     * @type {(string | number)}
     */
    set weight(weight: string | number); /**
     * Description placeholder
     */
    /**
     * Description placeholder
     *
     * @type {(string|number)}
     */
    get weight(): string | number;
    /**
     * Description placeholder
     *
     * @type {string}
     */
    set icon(icon: string);
    /**
     * Description placeholder
     *
     * @type {string}
     */
    get icon(): string;
    /**
     * Description placeholder
     *
     * @type {(string | number)}
     */
    set grade(grade: string | number); /**
     * Description placeholder
     */
    /**
     * Description placeholder
     *
     * @type {(string|number)}
     */
    get grade(): string | number;
    /**
     * Description placeholder
     *
     * @type {(string | number)}
     */
    set opticalSize(opticalSize: string | number); /**
     * Description placeholder
     */
    /**
     * Description placeholder
     *
     * @type {(string|number)}
     */
    get opticalSize(): string | number;
    /**
     * Description placeholder
     *
     * @type {(string | number)}
     */
    set fill(fill: string | number);
    /**
     * Description placeholder
     *
     * @type {(string|number)}
     */
    get fill(): string | number;
    /**
     * Description placeholder
     *
     * @private
     * @type {CBS_MaterialIconFontSettings}
     */
    private get settings();
    /**
     * Description placeholder
     *
     * @private
     * @type {CBS_MaterialIconFontSettings}
     */
    private set settings(value);
}
/**
 * Description placeholder
 *
 * @param {?string} [prefix]
 */
export const CBS_GenerateMaterialIcons: (prefix?: string) => void;
//# sourceMappingURL=index.d.ts.map
     }