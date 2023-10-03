import { CBS_Element, CBS_Options } from "../../1-main/2-element";
import { CBS } from "../../1-main/1-main";
import { CBS_Text } from "./1-text";


/**
 * Description placeholder
 *
 * @typedef {CBS_HeadingOptions}
 */
export type CBS_HeadingOptions = CBS_Options & {
}

/**
 * Description placeholder
 *
 * @class CBS_Heading
 * @typedef {CBS_Heading}
 * @extends {CBS_Component}
 */
export class CBS_Heading extends CBS_Text {
    /**
     * Creates an instance of CBS_Heading.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions) {
        super(options);
    }
}

/**
 * Description placeholder
 *
 * @class CBS_H1
 * @typedef {CBS_H1}
 * @extends {CBS_Heading}
 */
export class CBS_H1 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H1.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions) {
        super(options);

        this.el = document.createElement('h1');
    }
}

/**
 * Description placeholder
 *
 * @class CBS_H2
 * @typedef {CBS_H2}
 * @extends {CBS_Heading}
 */
export class CBS_H2 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H2.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions) {
        super(options);

        this.el = document.createElement('h2');
    }
}

/**
 * Description placeholder
 *
 * @class CBS_H3
 * @typedef {CBS_H3}
 * @extends {CBS_Heading}
 */
export class CBS_H3 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H3.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions) {
        super(options);

        this.el = document.createElement('h3');
    }
}

/**
 * Description placeholder
 *
 * @class CBS_H4
 * @typedef {CBS_H4}
 * @extends {CBS_Heading}
 */
export class CBS_H4 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H4.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions) {
        super(options);

        this.el = document.createElement('h4');
    }
}

/**
 * Description placeholder
 *
 * @class CBS_H5
 * @typedef {CBS_H5}
 * @extends {CBS_Heading}
 */
export class CBS_H5 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H5.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions) {
        super(options);

        this.el = document.createElement('h5');
    }
}

/**
 * Description placeholder
 *
 * @class CBS_H6
 * @typedef {CBS_H6}
 * @extends {CBS_Heading}
 */
export class CBS_H6 extends CBS_Heading {
    /**
     * Creates an instance of CBS_H6.
     *
     * @constructor
     * @param {?CBS_HeadingOptions} [options]
     */
    constructor(options?: CBS_HeadingOptions) {
        super(options);

        this.el = document.createElement('h6');
    }
}

CBS.addElement('h1', CBS_H1);
CBS.addElement('h2', CBS_H2);
CBS.addElement('h3', CBS_H3);
CBS.addElement('h4', CBS_H4);
CBS.addElement('h5', CBS_H5);
CBS.addElement('h6', CBS_H6);