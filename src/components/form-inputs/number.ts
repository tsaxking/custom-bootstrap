





type CBS_NumberInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

class CBS_NumberInput extends CBS_Input {
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