class CBS_Span extends CBS_Element {
    constructor(options?: CBS_TextOptions) {
        super(options);
        this.el = document.createElement('span');
    }
}

CBS.addElement('span', CBS_Span);