
type CBS_FileInputOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

class CBS_FileInput extends CBS_Input {
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