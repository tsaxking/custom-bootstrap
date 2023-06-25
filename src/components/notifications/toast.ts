class CBS_Toast extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        container: new CBS_ToastContainer()
    }

    private headerContent: CBS_NodeMap = [];
    private bodyContent: CBS_NodeMap = [];

    constructor() {
        super();

        this.addClass('position-relative');
        this.setAttribute('aria-live', 'polite');
        this.setAttribute('aria-atomic', 'true');
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
};

class CBS_ToastContainer extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        card: new CBS_ToastCard()
    }


    constructor() {
        super();

        this.addClass('toast-container', 'position-absolute', 'p-3');
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
    }
}

class CBS_ToastHeader extends CBS_Element {
    constructor() {
        super();

        this.addClass('toast-header');
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