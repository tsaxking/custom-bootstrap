type CBS_ToastOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    color?: CBS_Color;
}




class CBS_Toast extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        container: new CBS_ToastContainer()
    }

    private headerContent: CBS_NodeMap = [];
    private bodyContent: CBS_NodeMap = [];

    constructor(options?: CBS_ToastOptions) {
        super(options);

        this.addClass('position-relative');
        this.setAttribute('aria-live', 'polite');
        this.setAttribute('aria-atomic', 'true');


        ((this.subcomponents
            .container as CBS_Component)
            .subcomponents
            .card as CBS_Component)
            .subcomponents
            .body.addClass(`bg-${options?.color || 'info'}`);


        this.append(
            this.subcomponents.container
        );
    }


    set header(content: CBS_Node|CBS_NodeMap) {
        if (this.headerContent) {
            this.headerContent.forEach(node => {
                if (node instanceof HTMLElement) {
                    node.remove();
                } else if (node instanceof CBS_Element) {
                    node.destroy();
                }
                // and strings are automatically removed
            });
        }

        if (Array.isArray(content)) {
            this.headerContent = content;
            ((
                this.subcomponents.container as CBS_ToastContainer
                ).subcomponents.card as CBS_ToastCard
                ).subcomponents.header.append(...content);
        } else {
            this.headerContent = [content];
            ((
                this.subcomponents.container as CBS_ToastContainer
                ).subcomponents.card as CBS_ToastCard
                ).subcomponents.header.append(content);
        }
    }

    set body(content: CBS_Node|CBS_NodeMap) {
        if (this.bodyContent) {
            this.bodyContent.forEach(node => {
                if (node instanceof HTMLElement) {
                    node.remove();
                } else if (node instanceof CBS_Element) {
                    node.destroy();
                }
                // and strings are automatically removed
            });
        }


        if (Array.isArray(content)) {
            ((
                this.subcomponents.container as CBS_ToastContainer
                ).subcomponents.card as CBS_ToastCard
                ).subcomponents.body.append(...content);
        } else {
            ((
                this.subcomponents.container as CBS_ToastContainer
                ).subcomponents.card as CBS_ToastCard
                ).subcomponents.body.append(content);
        }
    }




    show() {
        document.body.append(this.el);

        (this.subcomponents
            .container as CBS_Component)
            .subcomponents
            .card
            .addClass('show');
    }

    hide() {
        (this.subcomponents
            .container as CBS_Component)
            .subcomponents
            .card
            .addClass('hide');
    }
};

class CBS_ToastContainer extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        card: new CBS_ToastCard()
    }


    constructor() {
        super();

        this.addClass('toast-container', 'position-absolute', 'p-3');

        this.append(
            this.subcomponents.card
        );
    }
};

class CBS_ToastCard extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        header: new CBS_ToastHeader(),
        body: new CBS_ToastBody()
    };

    constructor() {
        super();

        this.addClass('toast');

        this.append(
            this.subcomponents.header,
            this.subcomponents.body
        );
    }
}

class CBS_ToastHeader extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        close: new CBS_Button({
            classes: ['ml-2', 'mb-1'],
            attributes: {
                'data-dismiss': 'toast',
                'aria-label': 'Close'
            },
            style: {
                'outline': 'none'
            }
        })
    }

    constructor() {
        super();

        this.addClass('toast-header');
    
        this.append(
            this.subcomponents.close
        );
    }
}

class CBS_ToastBody extends CBS_Element {
    constructor() {
        super();

        this.addClass('toast-body');
    }
}

CBS.addElement('toast', CBS_Toast);

// add template svg toasts
(() => {
    const toasts = {
        info: {
            svg: CBS_SVG.fromTemplate('info'),
            textColor: 'dark'
        },
        success: {
            svg: CBS_SVG.fromTemplate('success'),
            textColor: 'light'
        },
        warning: {
            svg: CBS_SVG.fromTemplate('warning'),
            textColor: 'dark'
        },
        danger: {
            svg: CBS_SVG.fromTemplate('warning'),
            textColor: 'light'
        }
    };

    for (const [key, value] of Object.entries(toasts)) {
        const toast = new CBS_Toast();
        toast.addClass(`bg-${key}`, `text-${value.textColor}`, 'border-0');
        ((toast.subcomponents.container as CBS_ToastContainer).subcomponents.card as CBS_ToastCard)
        .subcomponents.header.append(
            value.svg
        );
        CBS_Toast.addTemplate(key, toast);
    }
})();