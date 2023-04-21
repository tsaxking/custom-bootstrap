/**
 * Description placeholder
 *
 * @typedef {CBS_DateInputOptions}
 */
type CBS_DateInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
};

/**
 * Description placeholder
 *
 * @class CBS_DateInput
 * @typedef {CBS_DateInput}
 * @extends {CBS_Input}
 */
class CBS_DateInput extends CBS_Input {
    /**
     * Creates an instance of CBS_DateInput.
     *
     * @constructor
     * @param {?CBS_DateInputOptions} [options]
     */
    constructor(options?: CBS_DateInputOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-control'
            ],
            attributes: {
                ...options?.attributes,
                type: 'date'
            }
        };
    }
}

CBS.addElement('input-date', CBS_DateInput);