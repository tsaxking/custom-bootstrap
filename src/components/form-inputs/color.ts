
type CBS_ColorInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
};

class CBS_ColorInput extends CBS_Input {
    constructor(options?: CBS_ColorInputOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-control'
            ],
            attributes: {
                ...options?.attributes,
                type: 'color'
            }
        }
    }
}


CBS.addElement('input-color', CBS_ColorInput);