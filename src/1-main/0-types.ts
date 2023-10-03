import { CBS_Element, CBS_Options } from "./2-element";
import { CBS_Col, CBS_ColOptions } from "../components/0-grid/col";
import { CBS_Container, CBS_ContainerOptions } from "../components/0-grid/container";
import { CBS_Row, CBS_RowOptions } from "../components/0-grid/row";
import { CBS_Text, CBS_TextOptions } from "../components/0-text/1-text";
import { CBS_Anchor, CBS_AnchorOptions } from "../components/0-text/anchor";
import { CBS_Heading, CBS_HeadingOptions } from "../components/0-text/header";
import { CBS_H1, CBS_H2, CBS_H3, CBS_H4, CBS_H5, CBS_H6 } from "../components/0-text/header";
import { CBS_Paragraph, CBS_ParagraphOptions } from "../components/0-text/paragraph";
import { CBS_Span } from "../components/0-text/span";
import { CBS_Button, CBS_ButtonOptions } from "../components/1-general/1-button";
import { CBS_ButtonGroup, CBS_ButtonGroupOptions } from "../components/1-general/button-group";
import { CBS_ButtonToolbar } from "../components/1-general/button-group";
import { CBS_Card, CBS_CardOptions } from "../components/1-general/card";
import { CBS_Modal, CBS_ModalOptions } from "../components/1-general/modal";
import { CBS_ProgressBar, CBS_ProgressBarOptions } from "../components/1-general/progress-bar";
import { CBS_Table, CBS_TableOptions } from "../components/1-general/table";
import { CBS_HorizontalLine } from "../components/1-general/lines";
import { CBS_Form, CBS_FormOptions } from "../components/form-inputs/0-form";
import { CBS_Input, CBS_InputOptions } from "../components/form-inputs/1-input";
import { CBS_Label, CBS_LabelOptions } from "../components/form-inputs/2-label";
import { CBS_InputGroup, CBS_InputGroupLabel, CBS_InputGroupOptions } from "../components/form-inputs/3-input-group";
import { CBS_InputLabelContainer, CBS_InputLabelContainerOptions } from "../components/form-inputs/3-input-label-container";
import { CBS_Checkbox, CBS_CheckboxInput, CBS_CheckboxLabel, CBS_CheckboxOptions } from "../components/form-inputs/checkbox";
import { CBS_ColorInput, CBS_ColorInputOptions } from "../components/form-inputs/color";
import { CBS_DateInput, CBS_DateInputOptions } from "../components/form-inputs/date";
import { CBS_EmailInput, CBS_EmailInputOptions } from "../components/form-inputs/email";
import { CBS_FileInput, CBS_FileInputOptions } from "../components/form-inputs/file";
import { CBS_FormText } from "../components/form-inputs/form-text";
import { CBS_NumberInput, CBS_NumberInputOptions } from "../components/form-inputs/number";
import { CBS_PasswordInput, CBS_PasswordInputOptions } from "../components/form-inputs/password";
import { CBS_Radio, CBS_RadioInput, CBS_RadioLabel, CBS_RadioOptions } from "../components/form-inputs/radio";
import { CBS_RangeInput, CBS_RangeInputOptions } from "../components/form-inputs/range";
import { CBS_SelectInput, CBS_SelectOptions } from "../components/form-inputs/select";
import { CBS_TextareaInput, CBS_TextareaOptions } from "../components/form-inputs/textarea";
import { CBS_InputLabelSave, CBS_InputLabelSaveOptions } from "../components/form-inputs/input-label-save";
import { CBS_ListItem, CBS_ListItemOptions } from "../components/list/list-item";
import { CBS_List, CBS_ListOptions } from "../components/list/list";
import { CBS_AudioCard, CBS_AudioElement } from "../components/media/audio";
import { CBS_AudioPlayer } from "../components/media/audio";
import { CBS_Contextmenu, CBS_ContextmenuOptions } from "../components/menus/contextmenu";
import { CBS_Document } from "./4-document";
import { CBS_Alert, CBS_AlertOptions } from "../components/notifications/alert";
import { CBS_Toast, CBS_ToastOptions } from "../components/notifications/toast";
import { CBS_TabNav } from "../components/menus/nav";
import { CBS_TextInput } from "../components/form-inputs/text";
import { CBS_Image, CBS_ImageOptions } from "../components/media/image";
import { CBS_SVG } from "../components/media/svg";
import { CBS_Video, CBS_VideoOptions } from "../components/media/video";
import { CBS_MaterialIcon } from "../z-extensions/material-icons";





export type CBS_Elements<type = unknown> = {
    'div': [CBS_Options, CBS_Element];



    'col': [CBS_ColOptions, CBS_Col];
    'container': [CBS_ContainerOptions, CBS_Container];
    'row': [CBS_RowOptions, CBS_Row];

    // text
    'text': [CBS_TextOptions, CBS_Text];
    'a': [CBS_AnchorOptions, CBS_Anchor];
    'heading': [CBS_HeadingOptions, CBS_Heading];
    'h1': [CBS_TextOptions, CBS_H1];
    'h2': [CBS_TextOptions, CBS_H2];
    'h3': [CBS_TextOptions, CBS_H3];
    'h4': [CBS_TextOptions, CBS_H4];
    'h5': [CBS_TextOptions, CBS_H5];
    'h6': [CBS_TextOptions, CBS_H6];
    'p': [CBS_ParagraphOptions, CBS_Paragraph];
    'span': [CBS_TextOptions, CBS_Span];

    // general
    'button': [CBS_ButtonOptions, CBS_Button];
    'button-group': [CBS_ButtonGroupOptions, CBS_ButtonGroup];
    'button-toolbar': [CBS_Options, CBS_ButtonToolbar];
    'card': [CBS_CardOptions, CBS_Card];
    'modal': [CBS_ModalOptions, CBS_Modal];
    'progress-bar': [CBS_ProgressBarOptions, CBS_ProgressBar];
    'table': [CBS_TableOptions, CBS_Table];
    'hr': [CBS_Options, CBS_HorizontalLine];
    
    // form-inputs
    'form': [CBS_FormOptions, CBS_Form];
    'input': [CBS_InputOptions, CBS_Input];
    'input-text': [CBS_InputOptions, CBS_TextInput];
    'label': [CBS_LabelOptions, CBS_Label];
    'input-group': [CBS_InputGroupOptions, CBS_InputGroup];
    'input-label-container': [CBS_InputLabelContainerOptions, CBS_InputLabelContainer];
    'input-checkbox': [CBS_Options, CBS_CheckboxInput];
    'input-color': [CBS_ColorInputOptions, CBS_ColorInput];
    'input-date': [CBS_DateInputOptions, CBS_DateInput];
    'input-email': [CBS_EmailInputOptions, CBS_EmailInput];
    'input-file': [CBS_FileInputOptions, CBS_FileInput];
    'input-form-text': [CBS_InputOptions, CBS_FormText];
    'input-number': [CBS_NumberInputOptions, CBS_NumberInput];
    'input-password': [CBS_PasswordInputOptions, CBS_PasswordInput];
    'input-radio': [CBS_RadioOptions, CBS_RadioInput];
    'radio-label': [CBS_Options, CBS_RadioLabel]
    'input-range': [CBS_RangeInputOptions, CBS_RangeInput];
    'range': [CBS_RangeInputOptions, CBS_RangeInput];
    'select': [CBS_SelectOptions, CBS_SelectInput];
    'input-textarea': [CBS_TextareaOptions, CBS_TextareaInput];
    'input-label-save': [CBS_InputLabelSaveOptions, CBS_InputLabelSave];
    'radio': [CBS_RadioOptions, CBS_Radio];
    'input-group-label': [CBS_InputGroupOptions, CBS_InputGroupLabel];
    'checkbox-label': [CBS_Options, CBS_CheckboxLabel];
    'checkbox': [CBS_CheckboxOptions, CBS_Checkbox];

    // list
    'li': [CBS_ListItemOptions, CBS_ListItem];
    'list': [CBS_ListOptions, CBS_List];

    // media
    'audio-card': [CBS_Options, CBS_AudioCard];
    'audio-player': [CBS_Options, CBS_AudioPlayer];
    'audio': [CBS_Options, CBS_AudioElement];
    'picture': [CBS_ImageOptions, CBS_Image];
    'svg': [CBS_Options, CBS_SVG];
    'video': [CBS_VideoOptions, CBS_Video];
    // 'video-player': CBS_VideoPlayerOptions;

    // menus
    'contextmenu': [CBS_ContextmenuOptions, CBS_Contextmenu];
    
    // dom
    'dom': [CBS_Options, CBS_Document];

    // notifications
    'alert': [CBS_AlertOptions, CBS_Alert];
    'toast': [CBS_ToastOptions, CBS_Toast];

    // tabs
    'tab-nav': [CBS_Options, CBS_TabNav];

    'material-icon': [CBS_Options, CBS_MaterialIcon];
}


export type CBS_ElementName = keyof CBS_Elements;