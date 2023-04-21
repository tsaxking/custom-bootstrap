(() => {
    // test for jQuery and popper
    try {
        $('hello-world');
    } catch {
        console.error('jQuery is not loaded!');
    }

    try {
        const el = document.createElement('div');
        el.classList.add('toast');
        $(el).toast('hide');
    } catch {
        console.error('Popper is not loaded!');
    }
})();


// Generic types
type CBS_NodeContainer = {
    [key: string]: CBS_Node;
}

// Used for subcomponents
type CBS_ElementContainer = {
    [key: string]: CBS_Element;
}

// Used for parameters
type CBS_ParameterValue = string|number|boolean|HTMLElement|undefined|Element|Node;

type CBS_Parameters = {
    [key: string]: CBS_ParameterValue;
}





// Is not currently used, but may be useful in the future?
interface CBS_ElementNameMap {
    'audio': CBS_AudioCard;
    'video': CBS_Video;

    'modal': CBS_Modal;

    'card': CBS_Card;
    'form': CBS_Form;
    'list': CBS_List;
    'progress-bar': CBS_Progress;

    'checkbox': CBS_CheckboxInput;
    'radio': CBS_RadioInput;
    'input': CBS_Input;
    'textarea': CBS_TextAreaInput;
    'button': CBS_Button;
    'select': CBS_SelectInput;

}


// TODO: Add all the elements to this interface
interface CBS {
    createElement<K extends keyof CBS_ElementNameMap>(tagName: K): CBS_ElementNameMap[K];
}

// Selector object returned by CustomBootstrap.parseSelector()s
type Selector = {
    tag: string;
    id?: string;
    classes?: string[];
    attributes?: {
        [key: string]: string;
    };
}

// Not currently used, but it's for someMethod() to return the constructor, not the element
type CBS_ElementConstructorMap = {
    [key: string]: new (options?: CBS_Options) => CBS_Element;
}

class CustomBootstrap {
    /**
     * 
     * @param {string} selector Css selector string (includes custom tag names)
     * @returns {Selector} object
     */
    static parseSelector(selector: string): Selector {
        selector = selector.trim();

        const getTag = (selector: string): string => {
            // get first word (before ., #, or [])
            const tag = selector.match(/^[^.#[]+/);
            return tag ? tag[0] : '';
        };

        const getId = (selector: string): string => {
            // get id (after #, and before . or [ or end of string)
            const id = selector.match(/#[^.#[\]]+/);
            return id ? id[0].substring(1) : '';
        }

        const getClasses = (selector: string): string[] => {
            // get classes (after ., and before # or [ or end of string)
            const classes = selector.match(/\.[^.#[\]]+/g);
            return classes ? classes.map(c => c.substring(1)) : [];
        }

        const getAttributes = (selector: string): { [key: string]: string } => {
            // get attributes (after [, and before ] or end of string)
            const attributes = selector.match(/\[[^\]]+\]/g);
            if (!attributes) return {};

            const result: { [key: string]: string } = {};
            attributes.forEach(a => {
                const parts = a.substring(1, a.length - 1).split('=');
                result[parts[0]] = parts[1];
            });
            return result;
        };

        return {
            tag: getTag(selector),
            id: getId(selector),
            classes: getClasses(selector),
            attributes: getAttributes(selector)
        };
    }





    // all of these are added when the constructor is created, so I commented them out
    // However, I may want to change this and I don't want to rewrite all of this
    #elements: CBS_ElementConstructorMap = {
        // // media
        // 'audio': CBS_Audio,
        // 'video': CBS_Video,
        // 'picture': CBS_Picture,

        // // modals
        // 'modal-alert': CBS_ModalAlert,
        // 'modal-confirm': CBS_ModalConfirm,
        // 'modal-select': CBS_ModalSelect,
        // 'modal': CBS_Modal,

        // // card
        // 'card': CBS_Card,

        // // form
        // 'form': CBS_Form,
        // 'input': CBS_Input,
        // 'input-textarea': CBS_TextAreaInput,
        // 'input-select': CBS_SelectInput,
        // 'input-radio': CBS_RadioInput,
        // 'input-checkbox': CBS_CheckboxInput,
        // 'input-email': CBS_EmailInput,
        // 'input-password': CBS_PasswordInput,
        // 'input-number': CBS_NumberInput,
        // 'input-range': CBS_RangeInput,
        // 'input-date': CBS_DateInput,
        // 'input-color': CBS_ColorInput,
        // 'input-file': CBS_FileInput,
        // 'input-text': CBS_TextInput,
        
        // // list
        // 'list': CBS_List,
        // 'list-item': CBS_ListItem,

        // // text
        // 'a': CBS_Anchor,
        // 'p': CBS_Paragraph,
        // 'h': CBS_Heading,
        // 'h1': CBS_H1,
        // 'h2': CBS_H2,
        // 'h3': CBS_H3,
        // 'h4': CBS_H4,
        // 'h5': CBS_H5,
        // 'h6': CBS_H6,

        // // progress
        // 'progress-bar': CBS_ProgressBar,

        // // button
        // 'button': CBS_Button,

        // // table
        // 'table': CBS_Table,
    };

    /**
     * 
     * @param {string} name Name of the element (tag name for parseSelector())
     * @param {CBS_Element} element Constructor of the custom element
     */
    addElement(name: string, element: new (options?: CBS_Options) => CBS_Element) {
        this.#elements[name] = element;
    }




    /**
     * 
     * @param {string} selector CSS Selector string (includes custom tag names)
     * @param {CBS_Options} options (optional) Options for the element 
     * @returns {CBS_Element} The element
     */
    createElement(selector: string, options?: CBS_Options): CBS_Element {
        const { tag, id, classes, attributes } = CustomBootstrap.parseSelector(selector);

        options = {
            ...(options || {}),
            id,
            classes,
            attributes
        }

        const element = this.#elements[tag];

        if (!element) {
            throw new Error(`Element ${tag} does not exist`);
        }

        return new element(options);
    }

    /**
     * 
     * @param {string} text HTML text to be parsed into an element
     * @returns {ChildNode|null} The element
     */
    createElementFromText(text: string): ChildNode|null {
        const div = document.createElement('div');
        div.innerHTML = text;
        return div.firstChild;
    }



    /**
     * 
     * @param {string} message Message to be displayed in the alert
     * @returns {Promise<void>} Promise that resolves when the alert is closed
     */
    async alert(message: any): Promise<void> {
        return new Promise((res, rej) => {
            const ok = new CBS_Button({
                color: 'primary'
            });

            ok.subcomponents.content.append('Okay');

            const modal = new CBS_Modal({
                buttons: [
                    ok
                ]
            });

            modal.subcomponents.body.append(message);

            ok.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res();
            });

            modal.on('hidden.bs.modal', () => res());
            modal.on('destroyed', () => res());
            modal.show();
        });
    }

    /**
     * 
     * @param {string} message Message to be displayed in the confirm
     * @returns {Promise<boolean>} Promise that resolves to true if the user clicks yes, false if the user clicks no
     */
    async confirm(message: any): Promise<boolean> {
        return new Promise((res, rej) => {
            const yes = new CBS_Button({
                color: 'primary'
            });

            yes.subcomponents.content.append('Yes');

            const no = new CBS_Button({
                color: 'secondary'
            });

            no.subcomponents.content.append('No');

            const modal = new CBS_Modal({
                buttons: [
                    yes,
                    no
                ]
            });

            modal.subcomponents.body.append(message);

            yes.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(true);
            });

            no.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(false);
            });

            modal.on('hidden.bs.modal', () => res(false));
            modal.on('destroyed', () => res(false));
            modal.show();
        });
    }

    /**
     * 
     * @param {CBS_Form} form Form to be displayed in the modal
     * @returns {Promise<any>} Promise that resolves to the form value when the user clicks submit
     */
    async modalForm(form: CBS_Form): Promise<any> {
        return new Promise((res, rej) => {
            const submit = new CBS_Button({
                color: 'primary'
            });

            submit.subcomponents.content.append('Submit');

            const modal = new CBS_Modal({
                buttons: [
                    submit
                ]
            });

            modal.subcomponents.body.append(form);



            // I have not implemented forms yet, so this is just a placeholder
            // the code will probably look like this

            // submit.on('click', () => {
            //     modal.hide();
            //     modal.on('animationend', () => {
            //         modal.destroy();
            //     });
            //     res(form.value);
            // });

            // form.on('submit', () => {
            //     modal.hide();
            //     modal.on('animationend', () => {
            //         modal.destroy();
            //     });
            //     res(form.value);
            // });

            // modal.on('hidden.bs.modal', () => res(form.value));
            // modal.on('destroyed', () => res(form.value));
            modal.show();
        });
    }

    /**
     * 
     * @param {string} message Message to be displayed in the prompt
     * @returns {Promise<string>} Promise that resolves to the user input when the user clicks submit
     */
    async prompt(message?: any): Promise<string> {
        return new Promise((res, rej) => {
            const ok = new CBS_Button({
                color: 'primary'
            });

            ok.subcomponents.content.append('Okay');

            const modal = new CBS_Modal({
                buttons: [
                    ok
                ]
            });

            const input = new CBS_TextInput();

            modal.subcomponents.body.append(message);
            modal.subcomponents.body.append(input);

            ok.on('click', () => {
                modal.hide();
                modal.on('animationend', () => {
                    modal.destroy();
                });
                res(input.value);
            });

            modal.on('hidden.bs.modal', () => res(input.value));
            modal.on('destroyed', () => res(input.value));
            modal.show();
        });
    }
}


const CBS = new CustomBootstrap();