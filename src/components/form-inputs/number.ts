import { CBS_Options } from "../../1-main/2-element";
import { CBS }from "../../1-main/1-main";
import { CBS_Input } from "./1-input";








/**
 * Description placeholder
 *
 * @typedef {CBS_NumberInputOptions}
 */
export type CBS_NumberInputOptions = CBS_Options & {
}

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
    constructor(options?: CBS_NumberInputOptions) {
        super(options);

        this.addClass('form-control');
        this.setAttribute('type', 'number');
    }

    get value(): number {
        return +(this.el as HTMLInputElement).value;
    }

    set value(value: number) {
        (this.el as HTMLInputElement).value = value.toString();
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


CBS.addElement('input-number', CBS_NumberInput);