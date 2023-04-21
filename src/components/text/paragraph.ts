type CBS_ParagraphOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}


class CBS_Paragraph extends CBS_Text {
    constructor(options?: CBS_ParagraphOptions) {
        super(options);

        this.el = document.createElement('p');
    }
}


CBS.addElement('paragraph', CBS_Paragraph);