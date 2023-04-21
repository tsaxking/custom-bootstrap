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


class CBS_ButtonContent extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('div');
    }
}


class CBS_Button extends CBS_Component {
    // options: CBS_ButtonOptions = {};
    components: CBS_NodeContainer = {
        content: new CBS_ButtonContent()
    };

    constructor(options?: CBS_ButtonOptions) {
        super(options);

        this.el = document.createElement('button');
    }

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

    disable() {
        this.el.setAttribute('disabled', 'disabled');
    }

    enable() {
        this.el.removeAttribute('disabled');
    }

    get enabled() {
        return !this.disabled;
    }

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