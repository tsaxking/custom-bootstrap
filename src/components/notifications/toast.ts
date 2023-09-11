type CBS_ToastOptions = CBS_Options & {
    color?: CBS_Color;
    dismiss?: number; // in milliseconds
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

        if (options?.color) {
            ((this.subcomponents.container as CBS_ToastContainer)
            .subcomponents.card as CBS_ToastCard)
            .addClass(`bg-${options.color}`);
        }

        if (options?.dismiss) {
            setTimeout(() => {
                this.destroy();
            }, options.dismiss);
        }

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
        title: new CBS_Span(),
        button: new CBS_Button({
            classes: ['btn-close'],
            attributes: {
                'data-bs-dismiss': 'toast',
                'aria-label': 'Close'
            }
        }),
        time: new CBS_Span()
    }

    interval: number = 0;

    constructor() {
        super();

        this.addClass('toast-header', 'bg-dark', 'text-light', 'border-0');

        this.subcomponents.title.addClass('me-auto');
        this.subcomponents.time.addClass('text-muted');

        this.subcomponents.button.on('click', () => {
            this.parent?.destroy();
        });

        const text = document.createTextNode('just now');
        const start = Date.now();

        this.interval = setInterval(() => {
            const now = Date.now();
            const diff = now - start;
            const seconds = Math.floor(diff / 1000);

            if (seconds < 60) {
                text.textContent = `${seconds} seconds ago`;
            } else if (seconds < 3600) {
                const minutes = Math.floor(seconds / 60);
                text.textContent = `${minutes} minutes ago`;
            } else if (seconds < 86400) {
                const hours = Math.floor(seconds / 3600);
                text.textContent = `${hours} hours ago`;
            } else {
                const days = Math.floor(seconds / 86400);
                text.textContent = `${days} days ago`;
            }
        }, 1000 * 30);

        this.subcomponents.time.append(
            text
        );
        
        this.append(
            this.subcomponents.title,
            this.subcomponents.button,
            this.subcomponents.time
        );
    }

    destroy() {
        clearInterval(this.interval);
        super.destroy();
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