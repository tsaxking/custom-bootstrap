
import { CBS_Options } from "../../1-main/2-element.ts";
import CBS from "../../1-main/1-main.ts";
import { CBS_Input } from "./1-input.ts";


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