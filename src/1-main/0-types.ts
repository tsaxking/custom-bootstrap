interface CBS_ElementNameMap {
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
    'card': CBS_Card;
    'modal': CBS_Modal;
    'progress-bar': CBS_ProgressBar;
    'table': CBS_Table;

    // form-inputs
    'form': CBS_Form;
    'input': CBS_Input;
    'label': CBS_Label;
    'input-group': CBS_InputGroup;
    'input-label-container': CBS_InputLabelContainer;
    'checkbox': CBS_Checkbox;
    'color': CBS_ColorInput;
    'date': CBS_DateInput;
    'email': CBS_EmailInput;
    'file': CBS_FileInput;
    'form-text': CBS_FormText;
    'number': CBS_NumberInput;
    'password': CBS_PasswordInput;
    'radio': CBS_Radio;
    'range': CBS_RangeInput;
    'select': CBS_SelectInput;
    'textarea': CBS_TextareaInput;

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

    [key: string]: CBS_Element|CBS_Component;
}

type CBS_ElementName = keyof CBS_ElementNameMap;