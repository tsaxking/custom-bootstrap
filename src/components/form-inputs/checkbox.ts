/**
 * Description placeholder
 *
 * @typedef {CBS_CheckboxOptions}
 */
type CBS_CheckboxOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    label?: string;
    mirrorValue?: any;
}


class CBS_CheckboxLabel extends CBS_Element {
    #text: string = '';

    constructor(options?: CBS_CheckboxOptions) {
        super(options);

        this.el = document.createElement('label');
        this.addClass('form-check-label');
    }

    set text(text: string) {
        this.#text = text;
        this.el.textContent = text;
    }

    get text() {
        return this.#text;
    }
};

/**
 * Description placeholder
 *
 * @class CBS_CheckboxInput
 * @typedef {CBS_CheckboxInput}
 * @extends {CBS_Input}
 */
class CBS_CheckboxInput extends CBS_Input {
    #mirrorValue: any;

    /**
     * Creates an instance of CBS_CheckboxInput.
     *
     * @constructor
     * @param {?CBS_CheckboxOptions} [options]
     */
    constructor(options?: CBS_CheckboxOptions) {
        super(options);

        this.el = document.createElement('input');

        this.addClass('form-check-input');
        this.setAttribute('type', 'checkbox');

        if (options?.mirrorValue) {
            this.#mirrorValue = options.mirrorValue;
        }
    }

    get value(): boolean {
        return (this.el as HTMLInputElement).checked;
    }

    get mirrorValue() {
        return this.#mirrorValue;
    }

    select() {
        (this.el as HTMLInputElement).indeterminate = false;
        (this.el as HTMLInputElement).checked = true;
    }

    deselect() {
        (this.el as HTMLInputElement).indeterminate = false;
        (this.el as HTMLInputElement).checked = false;
    }

    toggle() {
        (this.el as HTMLInputElement).indeterminate = false;
        (this.el as HTMLInputElement).checked = !(this.el as HTMLInputElement).checked;
    }

    disable() {
        (this.el as HTMLInputElement).disabled = true;
    }

    enable() {
        (this.el as HTMLInputElement).disabled = false;
    }

    semiCheck() {
        this.deselect();
        (this.el as HTMLInputElement).indeterminate = true;
    }
}



class CBS_Checkbox extends CBS_Input {
    subcomponents: CBS_ElementContainer = {
        input: new CBS_CheckboxInput(),
        label: new CBS_CheckboxLabel()
    }

    constructor(options?: CBS_CheckboxOptions) {
        super(options);

        if (options?.label) this.text = options.label;
    }

    set text(text: string) {
        (this.subcomponents.label as CBS_CheckboxLabel).text = text;
    }

    get text() {
        return (this.subcomponents.label as CBS_CheckboxLabel).text;
    }

    get value(): boolean {
        return (this.subcomponents.input as CBS_CheckboxInput).value;
    }

    get mirrorValue() {
        const input = this.subcomponents.input as CBS_CheckboxInput;
        return this.value ? input.mirrorValue : undefined;
    }

    select() {
        (this.subcomponents.input as CBS_CheckboxInput).select();
    }

    deselect() {
        (this.subcomponents.input as CBS_CheckboxInput).deselect();
    }

    toggle() {
        (this.subcomponents.input as CBS_CheckboxInput).toggle();
    }

    disable() {
        (this.subcomponents.input as CBS_CheckboxInput).disable();
    }

    enable() {
        (this.subcomponents.input as CBS_CheckboxInput).enable();
    }

    semiCheck() {
        (this.subcomponents.input as CBS_CheckboxInput).semiCheck();
    }
};



/**
 * Description placeholder
 *
 * @class CBS_CheckboxGroup
 * @typedef {CBS_CheckboxGroup}
 * @extends {CBS_Component}
 */
class CBS_CheckboxGroup extends CBS_Input {
    checkboxes: CBS_Checkbox[] = [];

    constructor(options?: CBS_CheckboxOptions) {
        super(options);

        this.el = document.createElement('div');
    }

    addCheckbox(value: string, options?: CBS_CheckboxOptions): CBS_Checkbox {
        const c = new CBS_Checkbox(options);
        c.text = value;

        this.append(c);
        this.checkboxes.push(c);

        return c;
    }

    removeCheckbox(value: string): boolean {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return false;

        this.removeElement(c);
        this.checkboxes.splice(this.checkboxes.indexOf(c), 1);
        return true;
    }

    clearCheckboxes() {
        this.checkboxes.forEach(checkbox => this.removeElement(checkbox));
        this.checkboxes = [];
    }

    get value(): any {
        return this.checkboxes.reduce((acc, check) => {
            if (check.value) acc[check.text] = true;
            return acc;
        }, {} as {[key: string]: boolean});
    }

    get mirrorValue(): any {
        return this.checkboxes.reduce((acc, check) => {
            if (check.value) acc[check.text] = check.mirrorValue;
            return acc;
        }, {} as {[key: string]: any})
    }










    select(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        c.select();
        return true;
    }

    isSelected(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        return c.value;
    }

    deselect(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        c.deselect();
        return true;
    }

    toggle(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        c.toggle();
        return true;
    }

    disable(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        c.disable();
        return true;
    }

    semiCheck(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        c.semiCheck();
        return true;
    }

    enable(value: string): boolean|undefined {
        const c = this.checkboxes.find(checkbox => checkbox.text === value);
        if (!c) return undefined;

        c.enable();
        return true;
    }









    // Selecting

    selectAll() {
        this.checkboxes.forEach(checkbox => checkbox.select());
    }

    deselectAll() {
        this.checkboxes.forEach(checkbox => checkbox.deselect());
    }

    toggleAll() {
        this.checkboxes.forEach(checkbox => checkbox.toggle());
    }

    disableAll() {
        this.checkboxes.forEach(checkbox => checkbox.disable());
    }

    enableAll() {
        this.checkboxes.forEach(checkbox => checkbox.enable());
    }

    semiCheckAll() {
        this.checkboxes.forEach(checkbox => checkbox.semiCheck());
    }
};


CBS.addElement('input-checkbox', CBS_CheckboxInput);