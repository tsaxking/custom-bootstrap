

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

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-control'
            ],
            attributes: {
                ...options?.attributes,
                type: 'email'
            }
        }
    }
}



CBS.addElement('input-email', CBS_EmailInput);