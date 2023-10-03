import { CBS_Options } from "../../1-main/2-element";
import CBS from "../../1-main/1-main";
import { CBS_Component } from "../../1-main/3-components";








/**
 * Description placeholder
 *
 * @typedef {CBS_ProgressBarOptions}
 */
export type CBS_ProgressBarOptions = CBS_Options & {
}

/**
 * Description placeholder
 *
 * @class CBS_ProgressBar
 * @typedef {CBS_ProgressBar}
 * @extends {CBS_Component}
 */
export class CBS_ProgressBar extends CBS_Component {
    /**
     * Creates an instance of CBS_ProgressBar.
     *
     * @constructor
     * @param {?CBS_ProgressBarOptions} [options]
     */
    constructor(options?: CBS_ProgressBarOptions) {
        super(options);

        this.addClass('progress-bar', 'rounded', 'shadow');
        this.setAttribute('aria-valuenow', '0');
        this.setAttribute('aria-valuemin', '0');
        this.setAttribute('aria-valuemax', '100');
        // this.style = {
        //     width: '0%',
        //     height: '24px'
        // }
    }
}

/**
 * Description placeholder
 *
 * @class CBS_Progress
 * @typedef {CBS_Progress}
 * @extends {CBS_Component}
 */
export class CBS_Progress extends CBS_Component {
    /**
     * Description placeholder
     *
     * @type {CBS_ElementContainer}
     */
    subcomponents: {
        text: CBS_Component;
        bar: CBS_ProgressBar;
    } = {
        text: new CBS_Component({
            classes: [
                'm-2'
            ]
        }),
        bar: new CBS_ProgressBar()
    }



    /**
     * Creates an instance of CBS_Progress.
     *
     * @constructor
     * @param {?CBS_ProgressBarOptions} [options]
     */
    constructor(options?: CBS_ProgressBarOptions) {

        super(options);

        this.el = document.createElement('div');

        this.addClass(
            'd-flex',
            'justify-content-between',
            'align-items-center',
            'mb-3',
            'w-100',
            'p-2',
            'position-fixed',
            'bg-secondary',
            'rounded',
            'text-light',
            );

        this.append(
            this.subcomponents.text,
            this.subcomponents.bar
        );

        this.subcomponents.text.el.innerHTML = 'Loading... {{progress}}%';

        this.parameters = {
            progress: 0
        }
    }

    /**
     * Sets the width of the progress bar as a number between 0 and 100
     *
     * @type {number}
     */
    set progress(progress: number) {
        if (progress < 0 || progress > 100) console.error('Progress must be between 0 and 100');
        else {
            this.parameters = {
                ...this.parameters,
                progress
            }

            this.subcomponents.bar.el.style.width = `${progress}%`;

            this.subcomponents.bar.options = {
                ...this.subcomponents.bar.options,
                attributes: {
                    ...this.subcomponents.bar.options.attributes,
                    'aria-valuenow': `${progress}`
                }
            }
        }
    }

    /**
     * Gets the width of the progress bar
     *
     * @type {number}
     */
    get progress() {
        return this.parameters.progress as number;
    }

    /**
     * Removes the progress bar from the DOM with a fade out animation
     */
    destroy(): void {
        setTimeout(super.destroy, 1000); // in case the animation doesn't work

        this.el.classList.add('animate__fadeOutUp');
        this.el.classList.remove('animate__fadeInDown');

        this.on('animationend', () => {
            super.destroy();
        });
    }
}




CBS.addElement('progress-bar', CBS_Progress);