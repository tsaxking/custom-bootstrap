import { CBS_Element, CBS_Options, CBS_Node, CBS_NodeMap } from "../../1-main/2-element";
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
 * @typedef {CBS_TextareaOptions}
 */
export type CBS_TextareaOptions = CBS_Options & {
}

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
    constructor(options?: CBS_TextareaOptions) {
        super(options);

        this.addClass('form-control');

        this.el = document.createElement('textarea');
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get value(): string {
        return (this.el as HTMLTextAreaElement).value;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set value(value: string) {
        (this.el as HTMLTextAreaElement).value = value;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    get columns(): number {
        return (this.el as HTMLTextAreaElement).cols;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set columns(value: number) {
        (this.el as HTMLTextAreaElement).cols = value;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    get rows(): number {
        return (this.el as HTMLTextAreaElement).rows;
    }

    /**
     * Description placeholder
     *
     * @type {number}
     */
    set rows(value: number) {
        (this.el as HTMLTextAreaElement).rows = value;
    }



    /**
     * Description placeholder
     *
     * @readonly
     * @type {any}
     */
    get mirrorValue():any {
        if (this.getMirrorValue) return this.getMirrorValue(this.value);
        return this.mirrorValues[this.value];
    }
}


CBS.addElement('input-textarea', CBS_TextareaInput);