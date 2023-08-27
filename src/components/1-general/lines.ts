class CBS_HorizontalLine extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('hr');
    }
}

CBS.addElement('hr', CBS_HorizontalLine);