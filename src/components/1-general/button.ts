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
    size?: CBS_Size;
    color?: CBS_Color;
    shadow?: boolean;
}



/**
 * Description placeholder
 *
 * @class CBS_Button
 * @typedef {CBS_Button}
 * @extends {CBS_Component}
 */
class CBS_Button extends CBS_Element {
    /**
     * Creates an instance of CBS_Button.
     *
     * @constructor
     * @param {?CBS_ButtonOptions} [options]
     */
    constructor(options?: CBS_ButtonOptions) {
        // console.log('CBS_Button constructor', JSON.stringify(options));

        super(options);

        this.el = document.createElement('button');

        this.addClass('btn');
    }



    /**
     * Description placeholder
     *
     * @type {CBS_ButtonOptions}
     */
    set options(options: CBS_ButtonOptions) {
        super.options = options;

        if (options.color) {
            if (options.outlined) {
                this.el.classList.add(`btn-outline-${options.color}`);
            } else {
                this.el.classList.add(`btn-${options.color}`);
            }
        }

        if (options.size) {
            this.addClass(`btn-${options.size}`);
            // this.el.classList.add(`btn-${options.size}`);
        }

        if (options.rounded) {
            this.addClass(`btn-rounded`);
            // this.el.classList.add(`btn-rounded`);
        }

        if (options.shadow) {
            this.addClass(`btn-shadow`);
            // this.el.classList.add(`btn-shadow`);
        }
    }

    get options() {
        return this._options;
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
        color: CBS_Color.secondary,
        size: CBS_Size.sm,
        classes: ['btn-close'],
        attributes: {
            'type': 'button',
            'data-bs-dismiss': 'modal',
            'aria-label': 'Close'
        }
    });

    // modalClose.removeClass('btn');

    CBS_Button.addTemplate('modal-close', modalClose);
})();