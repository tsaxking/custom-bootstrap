import { CBS_Element, CBS_Options, CBS_Node } from "../../1-main/2-element.ts";
import CBS from "../../1-main/1-main.ts";
import { CBS_InputOptions } from "./1-input.ts";









/**
 * Description placeholder
 *
 * @typedef {CBS_LabelOptions}
 */
export type CBS_LabelOptions = CBS_Options & {
    name?: string;
}

/**
 * Description placeholder
 *
 * @class CBS_Label
 * @typedef {CBS_Label}
 * @extends {CBS_Element}
 */
export class CBS_Label extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    #text: string = '';
    
    /**
     * Creates an instance of CBS_Label.
     *
     * @constructor
     * @param {?CBS_InputOptions} [options]
     */
    constructor(options?: CBS_InputOptions) {
        super(options);

        this.el = document.createElement('label');
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set text(text: string) {
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