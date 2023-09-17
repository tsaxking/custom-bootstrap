/**
 * Description placeholder
 *
 * @typedef {CBS_ButtonOptions}
 */
type CBS_ButtonOptions = CBS_Options & {
    outlined?: boolean;
    rounded?: boolean;
    size?: CBS_Size;
    color?: CBS_Color;
    shadow?: boolean;

    text?: string;
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
            this.addClass(`btn-${options.size}` as CBS_Class);
            // this.el.classList.add(`btn-${options.size}`);
        }

        if (options.rounded) {
            this.addClass(`rounded`);
        }

        if (options.shadow) {
            this.addClass(`shadow`);
        }

        if (options.text) {
            this.clearElements();
            this.append(options.text);
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