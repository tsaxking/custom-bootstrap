
import { CBS_Element, CBS_Options, CBS_Node } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";
import { CustomBootstrap } from "../../1-main/1-main";



import { CBS_Container } from "../0-grid/container";
import { CBS_Button } from "../1-general/1-button";
import { CBS_InputOptions, CBS_Input, CBS_InputInterface, CBS_InputMirrorValueMap } from "./1-input";



import { CBS_Label } from "./2-label";


/**
 * Description placeholder
 *
 * @typedef {CBS_ColorInputOptions}
 */
export type CBS_ColorInputOptions = CBS_Options & {
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
    constructor(options?: CBS_ColorInputOptions) {
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
        return (this.el as HTMLInputElement).value;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value: string) {
        (this.el as HTMLInputElement).value = value;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue(): any {
        if (this.getMirrorValue) return this.getMirrorValue(this.value);

        return null;
    }
}


CBS.addElement('input-color', CBS_ColorInput);