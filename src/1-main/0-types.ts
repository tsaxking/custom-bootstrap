type CBS_ElementNameMap = {
    // grid
    'col': CBS_Col;
    'container': CBS_Container;
    'row': CBS_Row;

    // text
    'text': CBS_Text;
    'a': CBS_Anchor;
    'heading': CBS_Heading;
    'h1': CBS_H1;
    'h2': CBS_H2;
    'h3': CBS_H3;
    'h4': CBS_H4;
    'h5': CBS_H5;
    'h6': CBS_H6;
    'p': CBS_Paragraph;
    'span': CBS_Span;

    // general
    'button': CBS_Button;
    'button-group': CBS_ButtonGroup;
    'button-toolbar': CBS_ButtonToolbar;
    'card': CBS_Card;
    'modal': CBS_Modal;
    'progress-bar': CBS_ProgressBar;
    'table': CBS_Table;
    'hr': CBS_HorizontalLine;

    // form-inputs
    'form': CBS_Form;
    'input': CBS_Input;
    'label': CBS_Label;
    'input-group': CBS_InputGroup;
    'input-label-container': CBS_InputLabelContainer;
    'input-checkbox': CBS_Checkbox;
    'input-color': CBS_ColorInput;
    'input-date': CBS_DateInput;
    'input-email': CBS_EmailInput;
    'input-file': CBS_FileInput;
    'input-form-text': CBS_FormText;
    'input-number': CBS_NumberInput;
    'input-password': CBS_PasswordInput;
    'input-radio': CBS_Radio;
    'input-range': CBS_RangeInput;
    'range': CBS_RangeInput;
    'input-select': CBS_SelectInput;
    'select': CBS_SelectInput;
    'input-textarea': CBS_TextareaInput;

    // list
    'li': CBS_ListItem;
    'list': CBS_List;

    // media
    'audio': CBS_AudioElement;
    'audio-player': CBS_AudioPlayer;
    // 'video': CBS_VideoElement;
    // 'video-player': CBS_VideoPlayer;
    'image': CBS_Image;

    // menus
    'contextmenu': CBS_Contextmenu;

    // dom
    'dom': CBS_Document;

    // notifications
    'alert': CBS_Alert;
    'toast': CBS_Toast;

    // tabs
    'tab-nav': CBS_TabNav;

    [key: string]: CBS_Element;
}

type CBS_ElementOptionMap = {
    'col': CBS_ColOptions;
    'container': CBS_ContainerOptions;
    'row': CBS_RowOptions;

    // text
    'text': CBS_TextOptions;
    'a': CBS_AnchorOptions;
    'heading': CBS_HeadingOptions;
    'h1': CBS_TextOptions;
    'h2': CBS_TextOptions;
    'h3': CBS_TextOptions;
    'h4': CBS_TextOptions;
    'h5': CBS_TextOptions;
    'h6': CBS_TextOptions;
    'p': CBS_ParagraphOptions;
    'span': CBS_TextOptions;

    // general
    'button': CBS_ButtonOptions;
    'button-group': CBS_ButtonGroupOptions;
    'button-toolbar': CBS_Options;
    'card': CBS_CardOptions;
    'modal': CBS_ModalOptions;
    'progress-bar': CBS_ProgressBarOptions;
    'table': CBS_TableOptions;
    'hr': CBS_Options;
    
    // form-inputs
    'form': CBS_FormOptions;
    'input': CBS_InputOptions;
    'label': CBS_LabelOptions;
    'input-group': CBS_InputGroupOptions;
    'input-label-container': CBS_InputLabelContainerOptions;
    'input-checkbox': CBS_CheckboxOptions;
    'input-color': CBS_ColorInputOptions;
    'input-date': CBS_DateInputOptions;
    'input-email': CBS_EmailInputOptions;
    'input-file': CBS_FileInputOptions;
    'input-form-text': CBS_InputOptions;
    'input-number': CBS_NumberInputOptions;
    'input-password': CBS_PasswordInputOptions;
    'input-radio': CBS_RadioOptions;
    'input-range': CBS_RangeInputOptions;
    'range': CBS_RangeInputOptions;
    'input-select': CBS_InputOptions;
    'select': CBS_InputOptions;
    'input-textarea': CBS_InputOptions;

    // list
    'li': CBS_ListItemOptions;
    'list': CBS_ListOptions;

    // media
    'audio': CBS_Options;
    'audio-player': CBS_Options;
    // 'video': CBS_VideoElementOptions;
    // 'video-player': CBS_VideoPlayerOptions;

    // menus
    'contextmenu': CBS_ContextmenuOptions;
    
    // dom
    'dom': CBS_Options;

    // notifications
    'alert': CBS_AlertOptions;
    'toast': CBS_ToastOptions;

    // tabs
    'tab-nav': CBS_Options;
}



// type CBS_ElementMap = {
//     'col': {
//         options: CBS_ColOptions;
//         element: CBS_Col;
//     },
//     'container': {
//         options: CBS_ContainerOptions;
//         element: CBS_Container;
//     },
//     'row': {
//         options: CBS_RowOptions;
//         element: CBS_Row;
//     },
    
//     // text
//     'text': {
//         options: CBS_TextOptions;
//         element: CBS_Text;
//     },
//     'a': {
//         options: CBS_AnchorOptions;
//         element: CBS_Anchor;
//     },
//     'heading': {
//         options: CBS_HeadingOptions;
//         element: CBS_Heading;
//     },
//     'h1': {
//         options: CBS_TextOptions;
//         element: CBS_H1;
//     },
//     'h2': {
//         options: CBS_TextOptions;
//         element: CBS_H2;
//     },
//     'h3': {
//         options: CBS_TextOptions;
//         element: CBS_H3;
//     },
//     'h4': {
//         options: CBS_TextOptions;
//         element: CBS_H4;
//     },
//     'h5': {
//         options: CBS_TextOptions;
//         element: CBS_H5;
//     },
//     'h6': {
//         options: CBS_TextOptions;
//         element: CBS_H6;
//     },
//     'p': {
//         options: CBS_ParagraphOptions;
//         element: CBS_Paragraph;
//     },
//     'span': {
//         options: CBS_TextOptions;
//         element: CBS_Span;
//     },

//     // general
//     'button': {
//         options: CBS_ButtonOptions;
//         element: CBS_Button;
//     },
//     'button-group': {
//         options: CBS_ButtonGroupOptions;
//         element: CBS_ButtonGroup;
//     },
//     'button-toolbar': {
//         options: CBS_Options;
//         element: CBS_ButtonToolbar;
//     },
//     'card': {
//         options: CBS_CardOptions;
//         element: CBS_Card;
//     },
//     'modal': {
//         options: CBS_ModalOptions;
//         element: CBS_Modal;
//     },
//     'progress-bar': {
//         options: CBS_ProgressBarOptions;
//         element: CBS_ProgressBar;
//     },
//     'table': {
//         options: CBS_TableOptions;
//         element: CBS_Table;
//     },
//     'hr': {
//         options: CBS_Options;
//         element: CBS_HorizontalLine;
//     },

//     // form-inputs
//     'form': {
//         options: CBS_FormOptions;
//         element: CBS_Form;
//     },
//     'input': {
//         options: CBS_InputOptions;
//         element: CBS_Input;
//     },
//     'label': {
//         options: CBS_LabelOptions;
//         element: CBS_Label;
//     },
//     'input-group': {
//         options: CBS_InputGroupOptions;
//         element: CBS_InputGroup;
//     },
//     'input-label-container': {
//         options: CBS_InputLabelContainerOptions;
//         element: CBS_InputLabelContainer;
//     },
//     'input-checkbox': {
//         options: CBS_CheckboxOptions;
//         element: CBS_Checkbox;
//     },
//     'input-color': {
//         options: CBS_ColorInputOptions;
//         element: CBS_ColorInput;
//     },
//     'input-date': {
//         options: CBS_DateInputOptions;
//         element: CBS_DateInput;
//     },
//     'input-email': {
//         options: CBS_EmailInputOptions;
//         element: CBS_EmailInput;
//     },
//     'input-file': {
//         options: CBS_FileInputOptions;
//         element: CBS_FileInput;
//     },
//     'input-form-text': {
//         options: CBS_InputOptions;
//         element: CBS_Input;
//     },
//     'input-number': {
//         options: CBS_NumberInputOptions;
//         element: CBS_NumberInput;
//     },
//     'input-password': {
//         options: CBS_PasswordInputOptions;
//         element: CBS_PasswordInput;
//     },
//     'input-radio': {
//         options: CBS_RadioOptions;
//         element: CBS_Radio;
//     },
//     'input-range': {
//         options: CBS_RangeInputOptions;
//         element: CBS_RangeInput;
//     },
//     'range': {
//         options: CBS_RangeInputOptions;
//         element: CBS_RangeInput;
//     },
//     'input-select': {
//         options: CBS_InputOptions;
//         element: CBS_SelectInput;
//     },
//     'select': {
//         options: CBS_InputOptions;
//         element: CBS_SelectInput;
//     },
//     'input-textarea': {
//         options: CBS_InputOptions;
//         element: CBS_TextareaInput;
//     },

//     // list
//     'li': {
//         options: CBS_ListItemOptions;
//         element: CBS_ListItem;
//     },
//     'list': {
//         options: CBS_ListOptions;
//         element: CBS_List;
//     },

//     // media
//     'audio': {
//         options: CBS_Options;
//         element: CBS_AudioElement;
//     },
//     'audio-player': {
//         options: CBS_Options;
//         element: CBS_AudioPlayer;
//     },
//     // 'video': {
//     //     options: CBS_VideoElementOptions;
//     //     element: CBS_VideoElement;
//     // },
//     // 'video-player': {
//     //     options: CBS_VideoPlayerOptions;
//     //     element: CBS_VideoPlayer;
//     // },
//     'image': {
//         options: CBS_ImageOptions;
//         element: CBS_Image;
//     },

//     // menus
//     'contextmenu': {
//         options: CBS_ContextmenuOptions;
//         element: CBS_Contextmenu;
//     },

//     // dom
//     'dom': {
//         options: CBS_Options;
//         element: CBS_Document;
//     },

//     // notifications
//     'alert': {
//         options: CBS_AlertOptions;
//         element: CBS_Alert;
//     },
//     'toast': {
//         options: CBS_ToastOptions;
//         element: CBS_Toast;
//     },

//     // tabs
//     'tab-nav': {
//         options: CBS_Options;
//         element: CBS_TabNav;
//     }
// };


// type CBS_ElementName = keyof CBS_ElementMap;

type CBS_ElementName = keyof CBS_ElementOptionMap;