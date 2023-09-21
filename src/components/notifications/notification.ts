import { CBS_Element, CBS_Options, CBS_Node, CBS_NodeMap } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";
import { CustomBootstrap } from "../../1-main/1-main";



import { CBS_Container } from "../0-grid/container";
import { CBS_Button } from "../1-general/1-button";
import { CBS_Color, CBS_Align, CBS_Breakpoint, CBS_Icons, CBS_Size, CBS_Weight } from "../../1-main/enums";







import { CBS_H5, CBS_H6 } from "../0-text/header";
import { CBS_CardBody } from "../1-general/card";
import { CBS_Paragraph } from "../0-text/paragraph";
import { CBS_Text } from "../0-text/1-text";
import { CBS_Toast } from "./toast";
import { CBS_Alert } from "./alert";


export type CBS_NotificationOptions = CBS_Options & {

    color?: CBS_Color
    type?: 'alert' | 'toast';
}


export class CBS_Notification extends CBS_Component {
    subcomponents: {
        notification: CBS_Alert | CBS_Toast;
    };

    constructor(options?: CBS_NotificationOptions) {
        super(options);

        if (options?.type) {
            let notification: CBS_Alert | CBS_Toast;
            switch (options.type) {
                case 'alert':
                    notification = new CBS_Alert(options);
                    this.subcomponents = {
                        notification
                    };
                    break;
                case 'toast':
                    notification = new CBS_Toast(options);
                    this.subcomponents = {
                        notification
                    };
                    break;
            }
        } else {
            this.subcomponents = {
                notification: new CBS_Alert()
            };
        }
    }
}