import { CBS_Element, CBS_Options, CBS_Node, CBS_NodeMap } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";
import { CustomBootstrap } from "../../1-main/1-main";



import { CBS_Container } from "../0-grid/container";
import { CBS_Button } from "../1-general/1-button";







import { CBS_H5, CBS_H6 } from "../0-text/header";
import { CBS_CardBody } from "../1-general/card";
import { CBS_Paragraph } from "../0-text/paragraph";
import { CBS_Text } from "../0-text/1-text";
import { CBS_ListItemOptions } from "../list/list-item";



/**
 * Hides and shows content based on the selected tab
 * @date 8/25/2023
 *
 * @class CBS_TabNav
 * @typedef {CBS_TabNav}
 * @extends {CBS_Component}
 */
export class CBS_TabNav extends CBS_Component {
    /**
     * The pages of the tab nav
     * @date 8/25/2023
     *
     * @public
     * @readonly
     */
    public readonly pages: {
        [key: string]: CBS_TabPage
    } = {};

    /**
     * The container the pages are store in (must be put in separately)
     * @date 8/25/2023
     *
     * @public
     * @readonly
     * @type {CBS_Element}
     */
    public readonly container: CBS_Element = new CBS_Element();

    /**
     * Creates an instance of CBS_TabNav
     * @date 8/25/2023
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);

        this.el = document.createElement('ul');

        this.addClass('nav');
    }

    /**
     * Adds a page to the tab nav and returns it
     * @date 8/25/2023
     *
     * @param {string} name
     * @param {CBS_Node} content
     * @param {?CBS_ListItemOptions} [options]
     * @returns {*}
     */
    addPage(name: string, content: CBS_Node, options?: CBS_ListItemOptions): CBS_TabPage {
        if (this.pages[name]) throw new Error('A page with that name already exists');
        const li = CBS.createElement('li', options);
        li.addClass('nav-item');

        const a = CBS.createElement('a');
        a.addClass('nav-link');
        a.setAttribute('href', '#');

        a.append(name);
        li.append(a);
        this.append(li);

        const page = new CBS_TabPage();
        page.append(content);
        this.container.append(page);
        this.pages[name] = page;

        if (Object.keys(this.pages).length === 1) {
            page.show();
            a.addClass('active');
        } else {
            page.hide();
        }

        li.on('click', (e: Event) => {
            e.preventDefault();
            page.show();
            for (const key in this.pages) {
                if (key !== name) this.pages[key].hide();
            }

            this.el.querySelector('.active')?.classList.remove('active');

            a.addClass('active');
        });

        return page;
    }
}


/**
 * The wrapper for the content of a tab
 * @date 8/25/2023
 *
 * @class CBS_TabPage
 * @typedef {CBS_TabPage}
 * @extends {CBS_Element}
 */
export class CBS_TabPage extends CBS_Element {
    /**
     * Creates an instance of CBS_TabPage.
     * @date 8/25/2023
     *
     * @constructor
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);
    }
}


CBS.addElement('tab-nav', CBS_TabNav);