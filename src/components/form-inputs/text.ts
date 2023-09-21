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
 * @typedef {CBS_TextInputOptions}
 */
export type CBS_TextInputOptions = CBS_Options & {
    // TODO: add these
    name?: string;
    label?: string;
    value?: string;
    group?: boolean;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;

    datalist?: string;
}

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
    constructor(options?: CBS_TextInputOptions) {
        super(options);

        this.addClass('form-control');
        this.setAttribute('type', 'text');
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value(): string {
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
    get mirrorValue() {
        return this.mirrorValues[this.value];
    }
}



CBS.addElement('input-text', CBS_TextInput);