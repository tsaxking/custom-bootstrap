type CBS_ButtonGroupOptions = CBS_Options & {
    vertical?: boolean;
}


class CBS_ButtonGroup extends CBS_Element {
    constructor(options?: CBS_ButtonGroupOptions) {
        super(options);

        if (options?.vertical) {
            this.addClass('btn-group-vertical');
        } else {
            this.addClass('btn-group');
        }

        this.setAttribute('role', 'group');
    }
}

CBS.addElement('button-group', CBS_ButtonGroup);


class CBS_ButtonToolbar extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.addClass('btn-toolbar');
        this.setAttribute('role', 'toolbar');
    }
}

CBS.addElement('button-toolbar', CBS_ButtonToolbar);