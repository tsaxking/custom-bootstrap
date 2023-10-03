import { CBS_Element, CBS_Options } from "../../1-main/2-element";
import { CBS_Class } from "../../1-main/classes";
import { CBS_Color, CBS_Align, CBS_Breakpoint, CBS_Icons, CBS_Size, CBS_Weight } from "../../1-main/enums";


/**
 * Description placeholder
 *
 * @typedef {CBS_TextOptions}
 */
export type CBS_TextOptions = CBS_Options & {
}


/**
 * Description placeholder
 *
 * @class CBS_Text
 * @typedef {CBS_Component}
 * @extends {CBS_Element}
 */
export class CBS_Text extends CBS_Element {
    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {?CBS_Color}
     */
    __color?: CBS_Color;
    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {?CBS_Size}
     */
    __size?: CBS_Size;
    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {?CBS_Weight}
     */
    __weight?: CBS_Weight;
    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {?CBS_Align}
     */
    __align?: CBS_Align;
    /**
     * Creates an instance of CBS_Text.
     *
     * @constructor
     * @param {?CBS_TextOptions} [options]
     */
    constructor(options?: CBS_TextOptions) {
        super(options);
    }

    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {string}
     */
    set text(text: string) {
        this.el.innerText = text;
    }

    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {string}
     */
    get text(): string {
        return this.el.innerText;
    }

    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {string}
     */
    set html(html: string) {
        this.el.innerHTML = html;
    }

    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {string}
     */
    get html(): string {
        return this.el.innerHTML;
    }

    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {*}
     */
    set color(color: CBS_Color|undefined) {
        if (this.color) this.removeClass(`text-${this.color}`); 
        this.__color = color;
        if (color) this.addClass(`text-${color}`);
    }

    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {(CBS_Color|undefined)}
     */
    get color(): CBS_Color|undefined {
        return this.__color;
    }

    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {*}
     */
    set size(size: CBS_Size|undefined) {
        if (this.size) this.removeClass(`text-${this.size}` as CBS_Class);
        this.__size = size;
        if (size) this.addClass(`text-${size}` as CBS_Class);
    }

    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {(CBS_Size|undefined)}
     */
    get size(): CBS_Size|undefined {
        return this.__size;
    }

    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {*}
     */
    set weight(weight: CBS_Weight|undefined) {
        if (this.weight) this.removeClass(`font-${this.weight}` as CBS_Class);
        this.__weight = weight;
        if (weight) this.addClass(`font-${weight}` as CBS_Class);
    }

    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {(CBS_Weight|undefined)}
     */
    get weight(): CBS_Weight|undefined {
        return this.__weight;
    }

    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {*}
     */
    set align(align: CBS_Align|undefined) {
        if (this.align) this.removeClass(`text-${this.align}` as CBS_Class);
        this.__align = align;
        if (align) this.addClass(`text-${align}` as CBS_Class);
    }

    /**
     * Description placeholder
     * @date 8/26/2023
     *
     * @type {(CBS_Align|undefined)}
     */
    get align(): CBS_Align|undefined {
        return this.__align;
    }
}
