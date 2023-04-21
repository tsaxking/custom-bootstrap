type CBS_RangeInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
};

class CBS_RangeInput extends CBS_Input {
    constructor(options?: CBS_RangeInputOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-control'
            ],
            attributes: {
                ...options?.attributes,
                type: 'range'
            }
        }
    }
}


CBS.addElement('input-range', CBS_RangeInput);