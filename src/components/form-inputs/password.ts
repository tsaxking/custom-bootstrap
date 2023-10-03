import CBS from "../../1-main/1-main";
import { CBS_InputOptions, CBS_Input } from "./1-input";








/**
 * Description placeholder
 *
 * @typedef {CBS_PasswordInputOptions}
 */
export type CBS_PasswordInputOptions = CBS_InputOptions & {
}

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
    constructor(options?: CBS_PasswordInputOptions) {
        super(options);

        this.addClass('form-control');
        this.setAttribute('type', 'password');
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
     * @type {any}
     */
    get mirrorValue():any {
        if (this.getMirrorValue) return this.getMirrorValue(this.value);
        return this.mirrorValues[this.value];
    }
}

CBS.addElement('input-password', CBS_PasswordInput);