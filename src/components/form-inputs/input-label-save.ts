import { CBS_Options } from "../../1-main/2-element.ts";
import CBS from "../../1-main/1-main.ts";
import { CBS_Component } from "../../1-main/3-components.ts";
import { CBS_Button } from "../1-general/1-button.ts";
import { CBS_Input, CBS_InputInterface } from "./1-input.ts";
import { CBS_Label } from "./2-label.ts";
import { CBS_InputLabelContainer } from "./3-input-label-container.ts";


export type CBS_InputLabelSaveOptions = CBS_Options & {
    clear?: boolean;
    input?: CBS_Input;
};







export class CBS_InputLabelSave extends CBS_Component implements CBS_InputInterface {
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

        this.save.on('click', () => {
            this.trigger('input.save');
        })

        this.append(
            this.subcomponents.container,
            this.subcomponents.save,
            this.subcomponents.clear
        );

        if (options) this.options = options;
    }

    get options() {
        return this._options;
    }

    set options(options: CBS_InputLabelSaveOptions) {
        super.options = options;

        if (options.clear) {
            this.subcomponents?.clear?.show();
        } else {
            this.subcomponents?.clear?.hide();
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

    get label() {
        return this.subcomponents.container.label;
    }

    set label(label: CBS_Label) {
        this.subcomponents.container.label = label;
    }
}


CBS.addElement('input-label-save', CBS_InputLabelSave);