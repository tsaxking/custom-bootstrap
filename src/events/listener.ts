import { CBS_Event } from "./events.ts";

/**
 * Description placeholder
 *
 * @typedef {CBS_ListenerCallback}
 */
export type CBS_ListenerCallback = (event: Event) => Promise<any>|any;

/**
 * Description placeholder
 *
 * @class CBS_Listener
 * @typedef {CBS_Listener}
 */
export class CBS_Listener {
    /**
     * Creates an instance of CBS_Listener.
     *
     * @constructor
     * @param {string} event
     * @param {CBS_ListenerCallback} callback
     * @param {boolean} [isAsync=true]
     */
    constructor(
        public readonly event: CBS_Event,
        public readonly callback: CBS_ListenerCallback, 
        public readonly isAsync: boolean = true) {
    }
}

/**
 * Description placeholder
 *
 * @typedef {CBS_EventCallback}
 */
export type CBS_EventCallback = {
    event: CBS_Event;
    callback: CBS_ListenerCallback;
    // options?: AddEventListenerOptions;
    isAsync: boolean;
}