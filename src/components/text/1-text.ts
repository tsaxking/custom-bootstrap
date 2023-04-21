type CBS_TextOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}


class CBS_Text extends CBS_Element {
    constructor(options?: CBS_TextOptions) {
        super(options);
    }
}


CBS.addElement('text', CBS_Text);