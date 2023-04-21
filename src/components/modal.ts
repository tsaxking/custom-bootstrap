type CBS_ModalOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
    buttons?: CBS_Button[];
}



class CBS_ModalTitle extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this._el = document.createElement('div');
    }
}

class CBS_ModalBody extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this._el = document.createElement('div');
    }
}

class CBS_ModalFooter extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this._el = document.createElement('div');
    }
}



class CBS_Modal extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        title: new CBS_ModalTitle(),
        body: new CBS_ModalBody(),
        footer: new CBS_ModalFooter()
    }

    constructor(options?: CBS_ModalOptions) {
        super(options);

        options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'modal',
                'fade'
            ],
            attributes: {
                ...options?.attributes,
                'tabindex': '-1',
                'role': 'dialog',
                'aria-hidden': 'true',
                'aria-labelledby': 'modal-title'
            }
        }

        this.append(
            this.subcomponents.title,
            this.subcomponents.body,
            this.subcomponents.footer
        );

        this.subcomponents.title.append(CBS_Button.fromTemplate('modal-close'));
    }



    set options(options: CBS_ModalOptions) {
        super.options = options;

        if (options.buttons) {
            this.subcomponents.footer.append(
                ...options.buttons
            );
        }
    }

    set title(title: Node|string) {
        this.removeElement(this.subcomponents.title);
        this.subcomponents.title = new CBS_ModalTitle();

        this.subcomponents.title.append(title);
    };

    set body(body: Node|string) {
        this.removeElement(this.subcomponents.body);
        this.subcomponents.body = new CBS_ModalBody();

        this.subcomponents.body.append(body);
    };

    set footer(footer: Node|string) {
        this.removeElement(this.subcomponents.footer);
        this.subcomponents.footer = new CBS_ModalFooter();

        this.subcomponents.footer.append(footer);
    };


    show() {
        $(this._el).modal('show');
    }

    hide() {
        $(this._el).modal('hide');
    }
}


CBS.addElement('modal', CBS_Modal);