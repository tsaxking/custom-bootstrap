import { CBS_Element, CBS_Options, CBS_Node } from "../../1-main/2-element";
import { CBS }from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";
import { CBS_Class } from "../../1-main/classes";
import { CBS_Button } from "../1-general/1-button";
import { CBS_Color } from "../../1-main/enums";
import { CBS_Span } from "../0-text/span";
import { CBS_SVG } from "../media/svg";



export type CBS_ToastOptions = CBS_Options & {
    color?: CBS_Color;
    dismiss?: number; // in milliseconds

    title?: CBS_Node;
    body?: CBS_Node;

    destroyOnHide?: boolean;
}


export class CBS_ToastBody extends CBS_Element {
    constructor() {
        super();

        this.addClass('toast-body');
    }
}

export class CBS_ToastHeader extends CBS_Component {
    subcomponents: {
        title: CBS_Span;
        button: CBS_Button;
        time: CBS_Span;
    } = {
        title: new CBS_Span({
            classes: ['me-auto', 'fw-bold']
        }),
        button: new CBS_Button({
            classes: ['btn-close', 'btn-close-white'],
            attributes: {
                'data-bs-dismiss': 'toast',
                'aria-label': 'Close'
            }
        }),
        time: new CBS_Span()
    }

    interval: number | NodeJS.Timeout = 0;

    constructor() {
        super();

        this.addClass('toast-header', 'bg-dark', 'border-0');

        this.subcomponents.title.addClass('me-auto');

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
            this.subcomponents.time,
            this.subcomponents.button
        );
    }

    destroy() {
        clearInterval(this.interval);
        super.destroy();
    }
}


export class CBS_ToastCard extends CBS_Component {
    subcomponents: {
        header: CBS_ToastHeader;
        body: CBS_ToastBody;
    } = {
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

export class CBS_ToastPolite extends CBS_Component {
    subcomponents: {
        container: CBS_ToastContainer;
    } = {
        container: new CBS_ToastContainer()
    }

    constructor() {
        super();

        this.setAttribute('aria-live', 'polite');
        this.setAttribute('aria-atomic', 'true');

        this.append(
            this.subcomponents.container
        );
    }
};



export class CBS_ToastContainer extends CBS_Component {
    subcomponents: {
        card: CBS_ToastCard;
    } = {
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




export class CBS_Toast extends CBS_Component {
    static container = new CBS_ToastPolite();

    subcomponents: {
        header: CBS_ToastHeader;
        body: CBS_ToastBody;
    } = {
        header: new CBS_ToastHeader(),
        body: new CBS_ToastBody()
    };

    constructor(options?: CBS_ToastOptions) {
        super(options);

        this.addClass('toast');

        if (options?.color) {
            this.addClass(`bg-${options.color}` as CBS_Class);

            this.subcomponents.header
                .addClass(`text-${options.color}` as CBS_Class);
        }

        if (options?.dismiss) {
            setTimeout(() => {
                this.hide();
            }, options.dismiss);
        }

        if (options?.body) {
            this.subcomponents.body.append(options.body);
        }

        if (options?.title) {
            this.subcomponents.header
                .subcomponents.title.append(options.title);
        }

        if (options?.destroyOnHide) {
            this.on('hidden.bs.toast', () => {
                this.destroy();
            });
        }

        this.append(
            this.subcomponents.header,
            this.subcomponents.body
        );
    }




    show() {
        CBS_Toast.container.subcomponents.container.append(this);

        this.addClass('show');
    }

    hide() {
        this.removeClass('show');

        this.trigger('hidden.bs.toast');
    }
};




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

    }
})();