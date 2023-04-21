
type CBS_AnchorOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

class CBS_Anchor extends CBS_Text {
    constructor(options?: CBS_AnchorOptions) {
        super(options);

        this.el = document.createElement('a');
    }
}




CBS.addElement('anchor', CBS_Anchor);