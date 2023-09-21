import { CBS_Element, CBS_Options, CBS_Node } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";



import { CBS_Container } from "../0-grid/container";
import { CBS_Button } from "../1-general/1-button";
import { CBS_InputOptions, CBS_Input, CBS_InputInterface, CBS_InputMirrorValueMap } from "./1-input";









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