import { CBS_Options } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Input } from "./1-input";




/**
 * Description placeholder
 *
 * @typedef {CBS_EmailInputOptions}
 */
export type CBS_EmailInputOptions = CBS_Options & {
}

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
    constructor(options?: CBS_EmailInputOptions) {
        super(options);

        this.addClass('form-control');
        this.setAttribute('type', 'email');
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
     * @async
     * @returns {unknown}
     */
    async isValid() {
        // TODO: check if the email is a valid email
        return true;
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



CBS.addElement('input-email', CBS_EmailInput);