
type CBS_SelectOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

class CBS_SelectInput extends CBS_Input {
    constructor(options?: CBS_SelectOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-select'
            ],
            attributes: {
                ...options?.attributes,
                type: 'select'
            }
        }
    }
}



CBS.addElement('input-select', CBS_SelectInput);