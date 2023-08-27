// class CBS_InputSubmit extends CBS_Component {
//     static create(name: string, type: string, buttonContent: CBS_Node) {
//         const input = new CBS_InputSubmit();
//         input.subcomponents.label.setAttribute('for', name);
//         input.subcomponents.label.content = name;
//         input.subcomponents.input.setAttribute('type', type);
//         input.subcomponents.input.setAttribute('name', name);
//         input.subcomponents.button.content = buttonContent;

//         return input;
//     }


//     subcomponents: CBS_ElementContainer = {
//         label: new CBS_Label(),
//         input: new CBS_Input(),
//         submit: new CBS_Button()
//     }

//     constructor(options?: CBS_Options) {
//         super(options);

//         this.subcomponents.submit.addClass('btn-success');

//         const container = CBS.createElement('container');
//         container.addRow().append(this.subcomponents.label);
//         const row = container.addRow({
//             classes: ['mb-3']
//         });
//         row.addCol({
//             sm: 8
//         }).append(this.subcomponents.input);
//         row.addCol({
//             sm: 4
//         }).append(this.subcomponents.submit);

//         this.append(container);
//     }

//     get value(): string {
//         return (this.subcomponents.input as CBS_Input).value;
//     }

//     set value(value: string) {
//         (this.subcomponents.input as CBS_Input).value = value;
//     }
// }