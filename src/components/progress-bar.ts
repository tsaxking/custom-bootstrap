type CBS_ProgressBarOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
}

class CBS_ProgressBar extends CBS_Component {
    constructor(options?: CBS_ProgressBarOptions) {
        super(options);

        this.options = {
            ...this.options,
            classes: [
                ...(this.options.classes || []),
                'progress-bar',
                'rounded',
                'shadow'
            ],
            attributes: {
                ...this.options.attributes,
                'aria-valuenow': '0',
                'aria-valuemin': '0',
                'aria-valuemax': '100'
            },
            style: {
                ...this.options.style,
                width: '0%',
                height: '24px'
            }
        }

        this.el = document.createElement('div');
    }
}

class CBS_Progress extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        text: new CBS_Paragraph({
            classes: [
                'm-2'
            ]
        }),
        bar: new CBS_ProgressBar()
    }



    constructor(options?: CBS_ProgressBarOptions) {
        super(options);

        this.el = document.createElement('div');

        this.options = {
            ...this.options,
            classes: [
                ...(this.options.classes || []),
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


                // To be used with animate.css
                'animate__animated',
                'animate__fadeInDown'
            ],
            style: {
                ...this.options.style,
                opacity: '0.9'
            }
        }

        this.append(
            this.subcomponents.text,
            this.subcomponents.bar
        );

        this.subcomponents.text.el.innerHTML = 'Loading... {{progress}}%';

        this.parameters = {
            progress: 0
        }
    }

    set progress(progress: number) {
        this.parameters = {
            ...this.parameters,
            progress
        }

        this.subcomponents.bar.options = {
            ...this.subcomponents.bar.options,
            style: {
                ...this.subcomponents.bar.options.style,
                width: `${progress}%`
            },
            attributes: {
                ...this.subcomponents.bar.options.attributes,
                'aria-valuenow': `${progress}`
            }
        }
    }

    get progress() {
        return this.parameters.progress as number;
    }

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