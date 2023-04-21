
/**
 * Description placeholder
 *
 * @typedef {CBS_FileInputOptions}
 */
type CBS_FileInputOptions = {
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
 * @class CBS_FileInput
 * @typedef {CBS_FileInput}
 * @extends {CBS_Input}
 */
class CBS_FileInput extends CBS_Input {
    /**
     * Creates an instance of CBS_FileInput.
     *
     * @constructor
     * @param {?CBS_FileInputOptions} [options]
     */
    constructor(options?: CBS_FileInputOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-control'
            ],
            attributes: {
                ...options?.attributes,
                type: 'file'
            }
        };
    }
}


CBS.addElement('input-file', CBS_FileInput);