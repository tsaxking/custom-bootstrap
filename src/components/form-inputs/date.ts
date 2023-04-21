type CBS_DateInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
};

class CBS_DateInput extends CBS_Input {
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