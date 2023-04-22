/**
 * Description placeholder
 *
 * @typedef {CBS_ButtonOptions}
 */
type CBS_ButtonOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    outlined?: boolean;
    rounded?: boolean;
    size?: CBS_Breakpoint;
    color?: string;
    shadow?: boolean;
}


/**
 * Description placeholder
 *
 * @class CBS_ButtonContent
 * @typedef {CBS_ButtonContent}
 * @extends {CBS_Element}
 */
class CBS_ButtonContent extends CBS_Element {
    /**
     * Creates an instance of CBS_ButtonContent.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('div');
    }
}


/**
 * Description placeholder
 *
 * @class CBS_Button
 * @typedef {CBS_Button}
 * @extends {CBS_Component}
 */
class CBS_Button extends CBS_Component {
    // options: CBS_ButtonOptions = {};
    /**
     * Description placeholder
     *
     * @type {CBS_NodeContainer}
     */
    subcomponents: CBS_ElementContainer = {
        content: new CBS_ButtonContent()
    };

    /**
     * Creates an instance of CBS_Button.
     *
     * @constructor
     * @param {?CBS_ButtonOptions} [options]
     */
    constructor(options?: CBS_ButtonOptions) {
        super(options);

        this.el = document.createElement('button');
    }

    /**
     * Description placeholder
     *
     * @type {CBS_ButtonOptions}
     */
    set options(options: CBS_ButtonOptions) {
        super.options = options;

        if (this.options.color) {
            if (this.options.outlined) {
                this.el.classList.add(`btn-outline-${this.options.color}`);
            } else {
                this.el.classList.add(`btn-${this.options.color}`);
            }
        }

        if (this.options.size) {
            this.el.classList.add(`btn-${this.options.size}`);
        }

        if (this.options.rounded) {
            this.el.classList.add(`btn-rounded`);
        }

        if (this.options.shadow) {
            this.el.classList.add(`btn-shadow`);
        }
    }

    /**
     * Description placeholder
     */
    disable() {
        this.el.setAttribute('disabled', 'disabled');
    }

    /**
     * Description placeholder
     */
    enable() {
        this.el.removeAttribute('disabled');
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {boolean}
     */
    get enabled() {
        return !this.disabled;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get disabled() {
        return this.el.hasAttribute('disabled');
    }
}


CBS.addElement('button', CBS_Button);

(() => {
    const modalClose = new CBS_Button({
        color: 'secondary',
        outlined: true,
        size: 'sm',
        classes: ['modal-close'],
        attributes: {
            'type': 'button',
            'data-bs-dismiss': 'modal',
            'aria-label': 'Close'
        }
    });

    CBS_Button.addTemplate('modal-close', modalClose);
})();