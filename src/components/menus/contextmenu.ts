/**
 * Description placeholder
 *
 * @class CBS_ContextMenuItem
 * @typedef {CBS_ContextMenuItem}
 * @extends {CBS_Paragraph}
 */
class CBS_ContextMenuItem extends CBS_Paragraph {
    /**
     * Creates an instance of CBS_ContextMenuItem.
     *
     * @constructor
     * @param {CBS_ContextmenuSelectOptions} options
     * @param {() => void} callback
     */
    constructor(options: CBS_ContextmenuSelectOptions, callback: () => void) {
        super({
            style: {
                cursor: 'pointer'
            }
        });

        this.content = options.name;

        if (options.color) {
            this.addClass(`text-${options.color}`);
            this.color = options.color;
        }

        this.addClass('fw-normal');

        this.on('click', callback);
        this.on('mouseover', () => this.addClass('bg-secondary'));
        this.on('mouseout', () => this.removeClass('bg-secondary'));

        // touch events
        this.on('touchstart', () => this.addClass('bg-secondary'));
        this.on('touchend', () => this.removeClass('bg-secondary'));
        this.on('touchcancel', () => this.removeClass('bg-secondary'));
        this.on('touchmove', () => this.removeClass('bg-secondary'));
        this.on('touchleave', () => this.removeClass('bg-secondary'));
        this.on('touchenter', () => this.addClass('bg-secondary'));
        this.on('touchforcechange', () => this.removeClass('bg-secondary'));
        this.on('touchend', () => this.removeClass('bg-secondary'));
    }
}

/**
 * Description placeholder
 *
 * @typedef {CBS_ContextmenuSections}
 */
type CBS_ContextmenuSections = {
    [key: string]: CBS_ContextmenuSection;
}

/**
 * Description placeholder
 *
 * @class CBS_ContextmenuSection
 * @typedef {CBS_ContextmenuSection}
 * @extends {CBS_Component}
 */
class CBS_ContextmenuSection extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ContextMenuItem[]}
     */
    items: CBS_ContextMenuItem[] = [];
    /**
     * Description placeholder
     *
     * @type {?CBS_Color}
     */
    color?: CBS_Color;

    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        title: new CBS_H6()
    }

    /**
     * Creates an instance of CBS_ContextmenuSection.
     *
     * @constructor
     * @param {CBS_ContextmenuSelectOptions} options
     */
    constructor(options: CBS_ContextmenuSelectOptions) {
        super();

        this.el = document.createElement('div');

        if (options.color) {
            this.addClass(`bg-${options.color}`);
            this.color = options.color;
        }

        this.addClass('fw-bold');

        this.content = options.name;
    }

    /**
     * Description placeholder
     *
     * @param {string} name
     * @param {() => void} callback
     * @returns {CBS_ContextMenuItem}
     */
    addItem(name: string, callback: () => void): CBS_ContextMenuItem {
        const item = new CBS_ContextMenuItem({ name, color: this.color }, callback);
        this.items.push(item);
        this.append(item);
        return item;
    }

    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {boolean}
     */
    removeItem(name: string): boolean {
        const index = this.items.findIndex((item) => item.text === name);
        if (index >= 0) {
            this.items.splice(index, 1);
            this.removeElement(this.items[index]);
            return true
        }
        return false;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set name(name: string) {
        (this.subcomponents.title as CBS_Text).text = name;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get name(): string {
        return (this.subcomponents.title as CBS_Text).text;
    }
}

/**
 * Description placeholder
 *
 * @typedef {CBS_ContextmenuSelectOptions}
 */
type CBS_ContextmenuSelectOptions = {
    color?: CBS_Color;
    name: string;
}

/**
 * Description placeholder
 *
 * @typedef {CBS_ContextmenuOptions}
 */
type CBS_ContextmenuOptions = CBS_Options & {
    color?: CBS_Color;

    ignoreList?: string[];
}

class CBS_SubContextmenu extends CBS_Component {
    constructor(options?: CBS_ContextmenuOptions) {
        super(options);

        this.addClass('position-absolute', 'rounded', 'shadow', 'bg-light');
        this.padding = 2;
        this.hide();

        if (options?.color) {
            options.color = CBS_Color.light;
        }
    }
    /**
     * Description placeholder
     *
     * @type {?CBS_Color}
     */
    color?: CBS_Color;

    
    /**
     * Description placeholder
     *
     * @type {CBS_ContextmenuOptions}
     */
    set options(options: CBS_ContextmenuOptions) {
        super.options = options;
        const { color } = this;
        if (color) this.removeClass(`bg-${color}`);

        if (options.color) {
            this.color = options.color;
            this.addClass(`bg-${options.color}`);
        }
    }

    get options() {
        return this._options;
    }
}

/**
 * Description placeholder
 *
 * @class CBS_Contextmenu
 * @typedef {CBS_Contextmenu}
 * @extends {CBS_Component}
 */
class CBS_Contextmenu extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ContextmenuSections}
     */
    sections: CBS_ContextmenuSections = {};
    /**
     * Description placeholder
     *
     * @type {?(CBS_Element|HTMLElement)}
     */
    actionElement?: CBS_Element|HTMLElement;

    ignoreList: string[] = [];

    subcomponents: CBS_ElementContainer = {}

    /**
     * Creates an instance of CBS_Contextmenu.
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_ContextmenuOptions) {
        super();

        this.ignoreList = options?.ignoreList || [];

        this.subcomponents.menu = new CBS_SubContextmenu(options);
        this.append(this.subcomponents.menu);

        this.addClass('position-relative');
    }

    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {CBS_ContextmenuSection}
     */
    addSection(name: string): CBS_ContextmenuSection {
        if (this.sections[name]) console.warn('There is already a section with the name:', name, 'on your context menu. It has been replaced');
        this.sections[name] = new CBS_ContextmenuSection({ color: (this.subcomponents.menu as CBS_SubContextmenu).color, name });
        this.subcomponents.menu.append(this.sections[name]);
        return this.sections[name];
    }

    /**
     * Description placeholder
     *
     * @param {string} name
     * @returns {boolean}
     */
    removeSection(name: string): boolean {
        if (this.sections[name]) {
            delete this.sections[name];
            this.subcomponents.menu.removeElement(this.sections[name]);
            return true;
        }
        return false;
    }

    /**
     * Description placeholder
     *
     * @param {(CBS_Element|HTMLElement)} element
     */
    apply(element: CBS_Element|HTMLElement) {
        try {
            if (this.actionElement) {
                if (this.actionElement instanceof CBS_Element) {
                    this.actionElement.off('contextmenu', this._show.bind(this));
                } else {
                    this.actionElement.removeEventListener('contextmenu', this.show.bind(this));
                }
            }

            if (element instanceof CBS_Element) {
                element.on('contextmenu', this._show.bind(this));
            } else {
                element.addEventListener('contextmenu', this._show.bind(this));
            }
        } catch {
            console.error('Error applying contextmenu to:', element, 'Was it an HTML element or CBS element?');
        }
    }

    /**
     * Description placeholder
     *
     * @private
     * @param {Event} e
     */
    private _show(e: Event) {
        e.preventDefault();
        document.body.appendChild(this.el);

        // this.style = {
        //     '--animate-duration': '0.2s'
        // };

        this.subcomponents.menu.addClass('animate__animated', 'animate__faster');

        const { x, y } = this.getXY(e as MouseEvent|TouchEvent);

        const { width, height } = this.subcomponents.menu.el.getBoundingClientRect();

        const { innerWidth, innerHeight } = window;

        let up: string, left: string;

        if (x + width > innerWidth) {
            this.subcomponents.menu.el.style.left = `${x - width}px`;
            left = 'Right';
        } else {
            this.subcomponents.menu.el.style.left = `${x}px`;
            left = 'Left';
        }

        if (y + height < innerHeight) {
            this.subcomponents.menu.el.style.top = `${y - height}px`;
            up = 'Down';
        } else {
            this.subcomponents.menu.el.style.top = `${y}px`;
            up = 'Up';
        }

        // this.subcomponents.menu.addClass(`animate__rotateIn${up}${left}`);

        this.subcomponents.menu.show();

        // const animateCB = () => {
        //     this.subcomponents.menu.removeClass(`animate__rotateIn${up}${left}`, 'animate__animated', 'animate__faster');
        //     this.off('animationend', animateCB);
        // }

        // setTimeout(animateCB, 200);

        // this.subcomponents.menu.on('animationend', animateCB);

        document.addEventListener('click', this._hide.bind(this));
        // document.addEventListener('contextmenu', this._hide.bind(this));
    }

    private _hide() {
        // this.style = {
        //     '--animate-duration': '0.2s'
        // };
        // this.subcomponents.menu.addClass('animate__fade', 'animate__animated', 'animate__faster');

        // const animateCB = () => {
        //     this.subcomponents.menu.removeClass(`animate__fade`, 'animate__animated', 'animate__faster');
        //     this.subcomponents.menu.off('animationend', animateCB);
        //     this.subcomponents.menu.hide();
        // }

        // setTimeout(animateCB, 200);

        // this.subcomponents.menu.on('animationend', animateCB);

        this.subcomponents.menu.hide();

        document.removeEventListener('click', this._hide.bind(this));
        document.removeEventListener('contextmenu', this._hide.bind(this));

    }
}


CBS.addElement('contextmenu', CBS_Contextmenu);