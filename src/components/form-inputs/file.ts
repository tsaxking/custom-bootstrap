import { CBS_Options } from "../../1-main/2-element";
import { CBS }from "../../1-main/1-main";
import { CBS_Input } from "./1-input";



/**
 * Description placeholder
 *
 * @typedef {CBS_FileInputOptions}
 */
export type CBS_FileInputOptions = CBS_Options & {
}

/**
 * Description placeholder
 *
 * @class CBS_FileInput
 * @typedef {CBS_FileInput}
 * @extends {CBS_Input}
 */
export class CBS_FileInput extends CBS_Input {
    /**
     * Creates an instance of CBS_FileInput.
     *
     * @constructor
     * @param {?CBS_FileInputOptions} [options]
     */
    constructor(options?: CBS_FileInputOptions) {
        super(options);

        this.addClass('form-control');
        this.setAttribute('type', 'file');
    }

    /**
     * Description placeholder
     *
     * @readonly
     * @type {FileList}
     */
    get value(): FileList {
        return (this.el as HTMLInputElement).files as FileList;
    }

    set value(value: FileList) {
        (this.el as HTMLInputElement).files = value;
    }

    get accept(): string[] {
        return (this.el as HTMLInputElement).accept.split(',');
    }

    set accept(value: string[]) {
        (this.el as HTMLInputElement).accept = value.join(',');
    }



    /**
     * Description placeholder
     */
    clearFiles() {
        // clear all files from input
        try { 
            (this.el as HTMLInputElement).value = null as any;
        } catch (e) {
            console.warn('You must be using an older browser, attempting to clear files again...');
            this.setAttribute('type', 'text');
            this.setAttribute('type', 'file');
        }
    }

    /**
     * Description placeholder
     *
     * @async
     * @returns {Promise<ReadableStream[]>}
     */
    async getFileStreams(): Promise<ReadableStream[]> {
        return new Promise((res, rej) => {
            const files = this.value;
            const streams: ReadableStream[] = Array.from(files).map((f) => {
                return f.stream();
            });

            res(streams);
        });
    }
}


CBS.addElement('input-file', CBS_FileInput);