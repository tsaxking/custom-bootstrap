





/**
 * Description placeholder
 *
 * @typedef {CBS_NumberInputOptions}
 */
type CBS_NumberInputOptions = {
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
 * @class CBS_NumberInput
 * @typedef {CBS_NumberInput}
 * @extends {CBS_Input}
 */
class CBS_NumberInput extends CBS_Input {
    /**
     * Creates an instance of CBS_NumberInput.
     *
     * @constructor
     * @param {?CBS_NumberInputOptions} [options]
     */
    constructor(options?: CBS_NumberInputOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-control'
            ],
            attributes: {
                ...options?.attributes,
                type: 'number'
            }
        }
    }
}


CBS.addElement('input-number', CBS_NumberInput);