type CBS_InputLabelSaveOptions = CBS_Options & {
    clear?: boolean;
    input?: CBS_Input;
};







class CBS_InputLabelSave extends CBS_Component implements CBS_InputInterface {
    subcomponents: {
        container: CBS_InputLabelContainer;
        save: CBS_Button;
        clear: CBS_Button;
    };


    constructor(options?: CBS_InputLabelSaveOptions) {
        super(options);

        this.subcomponents = {
            container: new CBS_InputLabelContainer(),
            save: new CBS_Button({
                color: 'primary',
                text: 'Save'
            }),
            clear: new CBS_Button({
                color: 'secondary',
                text: 'Clear'
            })
        }

        this.addClass('d-flex', 'flex-row', 'align-items-center', 'justify-content-between');

        this.clear.on('click', () => {
            this.input.value = '';
        });

        this.append(
            this.subcomponents.container,
            this.subcomponents.save,
            this.subcomponents.clear
        );
    }

    get options() {
        return this._options;
    }

    set options(options: CBS_InputLabelSaveOptions) {
        super.options = options;

        if (options.clear) {
            this.subcomponents.clear.show();
        } else {
            this.subcomponents.clear.hide();
        }
    }



    get value() {
        return this.subcomponents.container.value;
    };

    set value(value: string) {
        this.subcomponents.container.value = value;
    };

    get save() {
        return this.subcomponents.save;
    }

    get clear() {
        return this.subcomponents.clear;
    }

    get input() {
        return this.subcomponents.container.input;
    }

    set input(input: CBS_Input) {
        this.subcomponents.container.input = input;
    }
}


CBS.addElement('input-label-save', CBS_InputLabelSave);