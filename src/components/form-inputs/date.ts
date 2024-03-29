import { CBS }from "../../1-main/1-main";
import { CBS_InputOptions, CBS_Input } from "./1-input";



import { CBS_Label } from "./2-label";


/**
 * Description placeholder
 *
 * @typedef {CBS_DateInputOptions}
 */
export type CBS_DateInputOptions = CBS_InputOptions & {
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
    constructor(options?: CBS_DateInputOptions) {
        super(options);

        this.addClass('form-control');
        this.setAttribute('type', 'date');
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
     * @type {Date}
     */
    get mirrorValue(): Date {
        if (this.getMirrorValue) return this.getMirrorValue(this.value);
        return new Date(this.value);
    }
}

CBS.addElement('input-date', CBS_DateInput);