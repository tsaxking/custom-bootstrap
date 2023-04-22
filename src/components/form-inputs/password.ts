




/**
 * Description placeholder
 *
 * @typedef {CBS_PasswordInputOptions}
 */
type CBS_PasswordInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

/**
 * Description placeholder
 *
 * @class CBS_PasswordInput
 * @typedef {CBS_PasswordInput}
 * @extends {CBS_Input}
 */
class CBS_PasswordInput extends CBS_Input {
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

    get value(): string {
        return (this.el as HTMLInputElement).value;
    }

    set value(value: string) {
        (this.el as HTMLInputElement).value = value;
    }
}

CBS.addElement('input-password', CBS_PasswordInput);