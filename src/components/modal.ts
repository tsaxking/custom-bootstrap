/**
 * Description placeholder
 *
 * @typedef {CBS_ModalOptions}
 */
type CBS_ModalOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
    buttons?: CBS_Button[];
}



/**
 * Description placeholder
 *
 * @class CBS_ModalTitle
 * @typedef {CBS_ModalTitle}
 * @extends {CBS_Element}
 */
class CBS_ModalTitle extends CBS_Element {
    /**
     * Creates an instance of CBS_ModalTitle.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this._el = document.createElement('div');
    }
}

/**
 * Description placeholder
 *
 * @class CBS_ModalBody
 * @typedef {CBS_ModalBody}
 * @extends {CBS_Element}
 */
class CBS_ModalBody extends CBS_Element {
    /**
     * Creates an instance of CBS_ModalBody.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this._el = document.createElement('div');
    }
}

/**
 * Description placeholder
 *
 * @class CBS_ModalFooter
 * @typedef {CBS_ModalFooter}
 * @extends {CBS_Element}
 */
class CBS_ModalFooter extends CBS_Element {
    /**
     * Creates an instance of CBS_ModalFooter.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this._el = document.createElement('div');
    }
}

/**
 * Description placeholder
 *
 * @class CBS_ModalDialog
 * @typedef {CBS_ModalDialog}
 * @extends {CBS_Component}
 */
class CBS_ModalDialog extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        title: new CBS_ModalTitle(),
        body: new CBS_ModalBody(),
        footer: new CBS_ModalFooter()
    }


    /**
     * Creates an instance of CBS_ModalDialog.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);


        this.el = document.createElement('div');
        this.addClass('modal-dialog');
        this.setAttribute('role', 'document');

        this.append(
            this.subcomponents.title,
            this.subcomponents.body,
            this.subcomponents.footer
        );

        this.subcomponents.title.append(CBS_Button.fromTemplate('modal-close'));
    }
}

/**
 * Description placeholder
 *
 * @class CBS_Modal
 * @typedef {CBS_Modal}
 * @extends {CBS_Component}
 */
class CBS_Modal extends CBS_Element {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        dialog: new CBS_ModalDialog()
    }

    /**
     * Creates an instance of CBS_Modal.
     *
     * @constructor
     * @param {?CBS_ModalOptions} [options]
     */
    constructor(options?: CBS_ModalOptions) {
        super(options);

        this.addClass('modal','fade');
        this.setAttribute('tabindex', '-1');
        this.setAttribute('role', 'dialog');
        this.setAttribute('aria-hidden', 'true');
        this.setAttribute('aria-labelledby', 'modal-title');

        this.append(
            this.subcomponents.dialog
        );
    }



    /**
     * Description placeholder
     *
     * @type {CBS_ModalOptions}
     */
    set options(options: CBS_ModalOptions) {
        super.options = options;

        if (options.buttons) {
            this.subcomponents.footer.append(
                ...options.buttons
            );
        }
    }

    /**
     * Description placeholder
     *
     * @type {*}
     */
    set title(title: Node|string) {
        const dialog = this.subcomponents.dialog as CBS_ModalDialog;
        
        dialog.removeElement(this.subcomponents.title);
        dialog.subcomponents.title = new CBS_ModalTitle();

        dialog.subcomponents.title.append(title);
    }

    /**
     * Description placeholder
     *
     * @type {*}
     */
    set body(body: Node|string) {
        const dialog = this.subcomponents.dialog as CBS_ModalDialog;

        dialog.removeElement(this.subcomponents.body);
        dialog.subcomponents.body = new CBS_ModalBody();

        dialog.subcomponents.body.append(body);
    }

    /**
     * Description placeholder
     *
     * @type {*}
     */
    set footer(footer: Node|string) {
        const dialog = this.subcomponents.dialog as CBS_ModalDialog;

        dialog.removeElement(this.subcomponents.footer);
        dialog.subcomponents.footer = new CBS_ModalFooter();

        dialog.subcomponents.footer.append(footer);
    }

    /**
     * Description placeholder
     */
    show() {
        $(this._el).modal('show');
    }

    /**
     * Description placeholder
     */
    hide() {
        $(this._el).modal('hide');
    }
}


CBS.addElement('modal', CBS_Modal);