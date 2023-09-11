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

type CBS_ElementName = keyof CBS_ElementNameMap;