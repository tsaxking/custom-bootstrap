/**
 * Description placeholder
 *
 * @typedef {CBS_InputLabelContainerOptions}
 */
type CBS_InputLabelContainerOptions = CBS_Options & {
    type?: string;
}


/**
 * Description placeholder
 *
 * @class CBS_InputLabelContainer
 * @typedef {CBS_InputLabelContainer}
 * @extends {CBS_Component}
 * @implements {CBS_InputInterface}
 */
class CBS_InputLabelContainer extends CBS_Component implements CBS_InputInterface {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: CBS_ElementContainer = {
        input: new CBS_Input(),
        label: new CBS_Label(),
        text: new CBS_FormText()
    } 

    /**
     * Creates an instance of CBS_InputLabelContainer.
     *
     * @constructor
     * @param {CBS_Input} input
     * @param {CBS_Label} label
     * @param {?CBS_Options} [options]
     */
    constructor(options?: CBS_Options) {
        super(options);
        this.append(this.subcomponents.label);
        this.append(this.subcomponents.input);
        this.append(this.subcomponents.text);

        // random string id
        this.id = 'input-label-container-' + CustomBootstrap.newID();
        this.subcomponents.input.id = this.id + '-input';
        this.subcomponents.label.setAttribute('for', this.subcomponents.input.id);

        this.type = 'label';
    }

    /**
     * Description placeholder
     *
     * @type {CBS_Input}
     */
    set input(input: CBS_Input) {
        this.replace(this.subcomponents.input, input);
        this.subcomponents.input = input;

        this.subcomponents.input.id = this.id + '-input';
        this.subcomponents.label.setAttribute('for', this.subcomponents.input.id);
    }

    get input() {
        return (this.subcomponents.input as CBS_Input);
    }

    /**
     * Description placeholder
     *
     * @type {*}
     */
    set label(label: CBS_Label) {
        this.replace(this.subcomponents.label, label);
        this.subcomponents.label = label;

        this.subcomponents.label.setAttribute('for', this.subcomponents.input.id);
    }

    get label() {
        return (this.subcomponents.label as CBS_Label);
    }



    #type: string = 'label';
    set type(type: string) {
        this.#type = type;

        const {
            input,
            label
        } = this.subcomponents;

        this.clearElements();

        switch (type) {
            case 'label':
                (() => {
                    this.classes = [
                        'form-group'
                    ];
                    this.marginB = 3;
                    this.append(
                        label,
                        input
                    );
                })();
                break;
            case 'inline': 
                (() => {
                    this.classes = [
                        'form-group'
                    ];
                    const row = new CBS_Row({
                        classes: [
                            'g-3',
                            'align-items-center'
                        ]
                    });

                    const labelCol = row.addCol();
                    labelCol.addClass('col-auto');
                    labelCol.append(label);

                    const inputCol = row.addCol();
                    inputCol.addClass('col-auto');
                    inputCol.append(input);

                    this.append(row);
                })();
                break;
            case 'floating':
                (() => {
                    this.classes = [
                        'form-floating'
                    ];
                    this.append(
                        input,
                        label
                    );
                })();
                break;
        }
    }

    get type() {
        return this.#type;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get value() {
        return (this.subcomponents.input as CBS_Input).value;
    }

    set value(value: any) {
        (this.subcomponents.input as CBS_Input).value = value;
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {*}
     */
    get mirrorValue() {
        return (this.subcomponents.input as CBS_Input).mirrorValue;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    get formText() {
        return (this.subcomponents.text as CBS_FormText).content[0] as string;
    }

    /**
     * Description placeholder
     *
     * @type {string}
     */
    set formText(content: string) {
        (this.subcomponents.text as CBS_FormText).content = content;
    }
}

CBS.addElement('cbs-input-label-container', CBS_InputLabelContainer);