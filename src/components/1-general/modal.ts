/**
 * Description placeholder
 *
 * @typedef {CBS_ModalOptions}
 */
type CBS_ModalOptions = CBS_Options & {
    title?: string;
    buttons?: CBS_Button[];
    size?: CBS_Size;
    destroyOnHide?: boolean;
}



/**
 * Description placeholder
 *
 * @class CBS_ModalTitle
 * @typedef {CBS_ModalHeader}
 * @extends {CBS_Element}
 */
class CBS_ModalHeader extends CBS_Component {
    subcomponents: {
        title: CBS_H5;
    } = {
        title: new CBS_H5()
    }

    /**
     * Creates an instance of CBS_ModalTitle.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this.addClass('modal-header');
        this.prepend(
            this.subcomponents.title
        );
    }

    get text() {
        return (this.subcomponents.title as CBS_Text).text;
    }

    set text(text: string|null) {
        (this.subcomponents.title as CBS_Text).text = text || '';
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

        this.addClass('modal-body');
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

        this.addClass('modal-footer');
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
    subcomponents: {
        content: CBS_ModalContent;
        title: CBS_ModalHeader;
        body: CBS_ModalBody;
        footer: CBS_ModalFooter;
        hide: CBS_Button;
    };


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


        const content = new CBS_ModalContent();

        this.subcomponents = {
            content: content,
            title: content.subcomponents.header,
            body: content.subcomponents.body,
            footer: content.subcomponents.footer,
            hide: new CBS_Button({
                color: 'secondary',
                attributes: {
                    type: 'button',
                    'data-bs-dismiss': 'modal',
                    'aria-label': 'Close'
                },
                size: 'sm',
                classes: ['btn-close']
            })
        }

        content.append(
            this.subcomponents.title,
            this.subcomponents.body,
            this.subcomponents.footer
        )


        this.append(
            content
        );

        this.subcomponents.title.append(
            this.subcomponents.hide
        );
    }
}



class CBS_ModalContent extends CBS_Component {
    subcomponents: {
        header: CBS_ModalHeader;
        body: CBS_ModalBody;
        footer: CBS_ModalFooter;
    } = {
        header: new CBS_ModalHeader(),
        body: new CBS_ModalBody(),
        footer: new CBS_ModalFooter()
    }

    constructor(options?: CBS_Options) {
        super(options);

        this.addClass('modal-content');
    }
}



/**
 * Description placeholder
 *
 * @class CBS_Modal
 * @typedef {CBS_Modal}
 * @extends {CBS_Component}
 */
class CBS_Modal extends CBS_Component {

    subcomponents: {
        dialog: CBS_ModalDialog;
        title: CBS_ModalHeader;
    } = {
        dialog: new CBS_ModalDialog(),
        title: new CBS_ModalHeader()
    }

    private _size: CBS_Size = 'md';


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
        
        const dialog = new CBS_ModalDialog();

        dialog.subcomponents.hide.on('click', () => {
            this.hide();
        });

        if (options?.size) this.size = options.size;
        else this.size = 'md';

        this.append(
            this.subcomponents.dialog
        );

        if (options?.destroyOnHide) {
            this.on('hidden.bs.modal', () => {
                this.destroy();
            });
        }

        if (options?.buttons) {
            options.buttons.forEach(button => {
                this.footer.append(button);
            });
        }

        if (options?.title) {
            this.title.clearElements();
            this.title.append(options.title);
        }
    }

    get title() {
        return this.subcomponents.dialog.subcomponents.content.subcomponents.header.subcomponents.title;
    }

    set title(title: CBS_Element) {
        this.title.clearElements();
        this.title.append(title);
    }

    get body() {
        return this.subcomponents.dialog.subcomponents.content.subcomponents.body;
    }

    set body(body: CBS_Element) {
        this.body.clearElements();
        this.body.append(body);
    }

    get footer() {
        return this.subcomponents.dialog.subcomponents.content.subcomponents.footer;
    }

    set footer(footer: CBS_Element) {
        this.footer.clearElements();
        this.footer.append(footer);
    }

    set size(size: CBS_Size) {
        this.subcomponents.dialog.removeClass(`modal-${this._size}` as CBS_Class);
        this._size = size;
        this.subcomponents.dialog.addClass(`modal-${size}` as CBS_Class);
    }

    get size() {
        return this._size;
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