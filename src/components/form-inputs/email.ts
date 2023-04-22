

/**
 * Description placeholder
 *
 * @typedef {CBS_EmailInputOptions}
 */
type CBS_EmailInputOptions = {
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
 * @class CBS_EmailInput
 * @typedef {CBS_EmailInput}
 * @extends {CBS_Input}
 */
class CBS_EmailInput extends CBS_Input {
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

    get value(): string {
        return (this.el as HTMLInputElement).value;
    }

    set value(value: string) {
        (this.el as HTMLInputElement).value = value;
    }

    async isValid() {
        // TODO: check if the email is a valid email
        return true;
    }
}



CBS.addElement('input-email', CBS_EmailInput);