import { CBS_Element, CBS_Options } from "./2-element.ts";
import { CBS_Col, CBS_ColOptions } from "../components/0-grid/col.ts";
import { CBS_Container, CBS_ContainerOptions } from "../components/0-grid/container.ts";
import { CBS_Row, CBS_RowOptions } from "../components/0-grid/row.ts";
import { CBS_Text, CBS_TextOptions } from "../components/0-text/1-text.ts";
import { CBS_Anchor, CBS_AnchorOptions } from "../components/0-text/anchor.ts";
import { CBS_Heading, CBS_HeadingOptions } from "../components/0-text/header.ts";
import { CBS_H1, CBS_H2, CBS_H3, CBS_H4, CBS_H5, CBS_H6 } from "../components/0-text/header.ts";
import { CBS_Paragraph, CBS_ParagraphOptions } from "../components/0-text/paragraph.ts";
import { CBS_Span } from "../components/0-text/span.ts";
import { CBS_Button, CBS_ButtonOptions } from "../components/1-general/1-button.ts";
import { CBS_ButtonGroup, CBS_ButtonGroupOptions } from "../components/1-general/button-group.ts";
import { CBS_ButtonToolbar } from "../components/1-general/button-group.ts";
import { CBS_Card, CBS_CardOptions } from "../components/1-general/card.ts";
import { CBS_Modal, CBS_ModalOptions } from "../components/1-general/modal.ts";
import { CBS_ProgressBar, CBS_ProgressBarOptions } from "../components/1-general/progress-bar.ts";
import { CBS_Table, CBS_TableOptions } from "../components/1-general/table.ts";
import { CBS_HorizontalLine } from "../components/1-general/lines.ts";
import { CBS_Form, CBS_FormOptions } from "../components/form-inputs/0-form.ts";
import { CBS_Input, CBS_InputOptions } from "../components/form-inputs/1-input.ts";
import { CBS_Label, CBS_LabelOptions } from "../components/form-inputs/2-label.ts";
import { CBS_InputGroup, CBS_InputGroupLabel, CBS_InputGroupOptions } from "../components/form-inputs/3-input-group.ts";
import { CBS_InputLabelContainer, CBS_InputLabelContainerOptions } from "../components/form-inputs/3-input-label-container.ts";
import { CBS_Checkbox, CBS_CheckboxInput, CBS_CheckboxLabel, CBS_CheckboxOptions } from "../components/form-inputs/checkbox.ts";
import { CBS_ColorInput, CBS_ColorInputOptions } from "../components/form-inputs/color.ts";
import { CBS_DateInput, CBS_DateInputOptions } from "../components/form-inputs/date.ts";
import { CBS_EmailInput, CBS_EmailInputOptions } from "../components/form-inputs/email.ts";
import { CBS_FileInput, CBS_FileInputOptions } from "../components/form-inputs/file.ts";
import { CBS_FormText } from "../components/form-inputs/form-text.ts";
import { CBS_NumberInput, CBS_NumberInputOptions } from "../components/form-inputs/number.ts";
import { CBS_PasswordInput, CBS_PasswordInputOptions } from "../components/form-inputs/password.ts";
import { CBS_Radio, CBS_RadioInput, CBS_RadioLabel, CBS_RadioOptions } from "../components/form-inputs/radio.ts";
import { CBS_RangeInput, CBS_RangeInputOptions } from "../components/form-inputs/range.ts";
import { CBS_SelectInput, CBS_SelectOptions } from "../components/form-inputs/select.ts";
import { CBS_TextareaInput, CBS_TextareaOptions } from "../components/form-inputs/textarea.ts";
import { CBS_InputLabelSave, CBS_InputLabelSaveOptions } from "../components/form-inputs/input-label-save.ts";
import { CBS_ListItem, CBS_ListItemOptions } from "../components/list/list-item.ts";
import { CBS_List, CBS_ListOptions } from "../components/list/list.ts";
import { CBS_AudioCard, CBS_AudioElement } from "../components/media/audio.ts";
import { CBS_AudioPlayer } from "../components/media/audio.ts";
import { CBS_Contextmenu, CBS_ContextmenuOptions } from "../components/menus/contextmenu.ts";
import { CBS_Document } from "./4-document.ts";
import { CBS_Alert, CBS_AlertOptions } from "../components/notifications/alert.ts";
import { CBS_Toast, CBS_ToastOptions } from "../components/notifications/toast.ts";
import { CBS_TabNav } from "../components/menus/nav.ts";
import { CBS_TextInput } from "../components/form-inputs/text.ts";
import { CBS_Image, CBS_ImageOptions } from "../components/media/image.ts";
import { CBS_SVG } from "../components/media/svg.ts";
import { CBS_Video, CBS_VideoOptions } from "../components/media/video.ts";
import { CBS_MaterialIcon } from "../z-extensions/material-icons.ts";





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