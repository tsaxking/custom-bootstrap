




type CBS_TextareaOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

class CBS_TextAreaInput extends CBS_Input {
    constructor(options?: CBS_TextareaOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'form-control'
            ]
        }

        this.el = document.createElement('textarea');
    }
}


CBS.addElement('input-textarea', CBS_TextAreaInput);