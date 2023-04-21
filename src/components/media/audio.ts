type CBS_AudioOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }

    fadeTime?: number;
}

class CBS_AudioSource extends CBS_Element {
    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.el = document.createElement('source') as HTMLSourceElement;
    }

    set src(src: string) {
        (this.el as HTMLSourceElement).src = src;
    }

    get src(): string {
        return (this.el as HTMLSourceElement).src;
    }
}

class CBS_AudioElement extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        source: new CBS_AudioSource()
    }

    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.el = document.createElement('audio');
    }

    get fadeTime(): number{
        return (this.options as CBS_AudioOptions)?.fadeTime || 100;
    }

    async play() {
        this.volume = 0;
        (this.el as HTMLAudioElement).play();
        this.fadeIn(100).catch(() => {});
    }

    async pause() {
        await this.fadeOut(100).catch(() => {});
        (this.el as HTMLAudioElement).pause();
    }

    async stop() {
        await this.pause();
        this.currentTime = 0;
    }

    async fadeIn(duration: number): Promise<void> {
        return new Promise((resolve, reject) => {
            let volume: number = 0;
            let interval: number = duration / this.fadeTime;
            let increment: number = 1 / this.fadeTime;

            let fadeInInterval = setInterval(() => {
                if (volume >= 1) {
                    clearInterval(fadeInInterval);
                    resolve();
                } else {
                    volume += increment;
                    this.volume = volume;
                }
            }, interval);
        });
    }

    async fadeOut(duration: number): Promise<void> {
        return new Promise((res, rej) => {
            let interval: number = duration / this.fadeTime;
            let increment: number = 1 / this.fadeTime;
            
            let fadeOutInterval = setInterval(() => {
                if (this.volume <= 0) {
                    clearInterval(fadeOutInterval);
                    res();
                } else {
                    this.volume -= increment;
                }
            }, interval);
        });
    }

    set volume(volume: number) {
        (this.el as HTMLAudioElement).volume = volume;
    }

    get volume(): number {
        return (this.el as HTMLAudioElement).volume;
    }


    set src(src: string) {
        (this.subcomponents.source as CBS_AudioSource).src = src;
    }

    get src(): string {
        return (this.subcomponents.source as CBS_AudioSource).src;
    }

    set controls(controls: boolean) {
        (this.el as HTMLAudioElement).controls = controls;
    }

    get controls(): boolean {
        return (this.el as HTMLAudioElement).controls;
    }

    set autoplay(autoplay: boolean) {
        (this.el as HTMLAudioElement).autoplay = autoplay;
    }

    get autoplay(): boolean {
        return (this.el as HTMLAudioElement).autoplay;
    }

    #duration: number = 0;

    get duration(): Promise<number> {
        return new Promise((res, rej) => {
            if (this.#duration) {
                res(this.#duration);
            } else {
                this.on('loadedmetadata', () => {
                    this.#duration = (this.el as HTMLAudioElement).duration;
                    res(this.#duration);
                });
            }
        });
    }

    get currentTime(): number {
        return (this.el as HTMLAudioElement).currentTime;
    }

    set currentTime(currentTime: number) {
        (this.el as HTMLAudioElement).currentTime = currentTime;
    }

    get paused(): boolean {
        return (this.el as HTMLAudioElement).paused;
    }
}

class CBS_AudioPlayhead extends CBS_Element {
    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.options = {
            ...this.options,
            classes: [
                ...(this.options?.classes || [])
            ],
            style: {
                ...this.options?.style,
                width: '8px',
                height: '8px',
                '-webkit-border-radius': '50%',
                'border-radius': '50%',
                background: 'black',
                cursor: 'pointer',
                'margin-top': '-3px'
            }
        }

        this.el = document.createElement('div');
    }
}

class CBS_AudioTimeline extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        playhead: new CBS_AudioPlayhead()
    }

    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.options = {
            ...this.options,
            classes: [
                ...(this.options?.classes || []),
                'mt-2',
                'ms-1',
                'rounded'
            ],
            style: {
                ...this.options?.style,
                width: '90%',
                height: '2px',
                float: 'left',
                background: 'rgba(0, 0, 0, 0.3)',
            }
        }

        this.el = document.createElement('div');
    }

    async update(audio: CBS_AudioElement) {
        let playhead: CBS_AudioPlayhead = this.subcomponents.playhead as CBS_AudioPlayhead;
        let percentage: number = audio.currentTime / (await audio.duration) * 100;
        playhead.el.style.left = `${percentage}%`;
    }

    getProgress(clientX: number): number {
        let playhead: CBS_AudioPlayhead = this.subcomponents.playhead as CBS_AudioPlayhead;
        return (clientX - this.el.offsetLeft) / (this.el.offsetWidth - playhead.el.offsetWidth);
    }
}

CBS_AudioTimeline.addCustomEvent('playhead.move');


class CBS_AudioButton extends CBS_Element {
    constructor(type: string, options?: CBS_AudioOptions) {
        super(options);

        this.options = {
            ...this.options,
            classes: ['material-icons'],
            style: {
                ...this.options?.style,
                cursor: 'pointer',
                float: 'left',
                'margin-top': '12px'
            }
        }

        this.el = document.createElement('i');


        switch (type) {
            case 'toggle':
                this.el.innerHTML = 'play_arrow';
                break;
            case 'stop':
                this.el.innerHTML = 'stop';
                break;
        }
    }
}

class CBS_AudioPlayer extends CBS_Component {
    subcomponents: CBS_ElementContainer = {
        audio: new CBS_AudioElement(),
        toggleButton: new CBS_AudioButton('toggle'),
        stopButton: new CBS_AudioButton('stop'),
        timeline: new CBS_AudioTimeline()
    }

    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.el = document.createElement('div');


        const {
            audio,
            toggleButton,
            stopButton,
            timeline
        } = this.subcomponents;


        this.append(
            audio,
            toggleButton,
            stopButton,
            timeline
        );
        const toggleButtonContent = toggleButton.subcomponents.content as CBS_MaterialIcon;

        const pause = () => {
            toggleButtonContent.icon = 'play_arrow';
            toggleButtonContent.off('click', pause);
            toggleButtonContent.on('click', play);
            (audio as CBS_AudioElement).pause();
        }

        const play = () => {
            toggleButtonContent.icon = 'pause';
            toggleButtonContent.off('click', play);
            toggleButtonContent.on('click', pause);
            (audio as CBS_AudioElement).play();
        }

        const stop = () => {
            (audio as CBS_AudioElement).stop();
            pause();
        }


        audio.on('timeupdate', () => {
            (timeline as CBS_AudioTimeline).update(audio as CBS_AudioElement);
        });

        timeline.on('click', async (e) => {
            const progress = (timeline as CBS_AudioTimeline).getProgress((e as MouseEvent).clientX);

            (audio as CBS_AudioElement).currentTime = progress * (await (audio as CBS_AudioElement).duration);
        });

        const playhead  = timeline.subcomponents.playhead as CBS_AudioPlayhead;

        playhead.on('mousedown', async(e) => {
            (audio as CBS_AudioElement).pause();
            playhead.on('mousemove', async(e) => {
                const progress = (timeline as CBS_AudioTimeline).getProgress((e as MouseEvent).clientX);

                (audio as CBS_AudioElement).currentTime = progress * (await (audio as CBS_AudioElement).duration);
                (timeline as CBS_AudioTimeline).update(audio as CBS_AudioElement);
            });

            playhead.on('mouseup', async(e) => {
                playhead.off('mousemove');
                (audio as CBS_AudioElement).play();
            });
        });


        toggleButton.on('click', play);
        stopButton.on('click', stop);
    }
}


class CBS_AudioCardBody extends CBS_CardBody {
    subcomponents: CBS_ElementContainer = {
        title: new CBS_H5(),
        subtitle: new CBS_Paragraph(),
        player: new CBS_AudioPlayer()
    }

    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.el = document.createElement('div');

        this.append(
            this.subcomponents.title,
            this.subcomponents.subtitle,
            this.subcomponents.player
        );
    }
}


class CBS_AudioCard extends CBS_Card {
    subcomponents: CBS_ElementContainer = {
        image: new CBS_Image(),
        body: new CBS_AudioCardBody()
    }

    constructor(options?: CBS_AudioOptions) {
        super(options);

        this.el = document.createElement('div');

        this.append(
            this.subcomponents.image,
            this.subcomponents.body
        );
    }
}




CBS.addElement('audio-card', CBS_AudioCard);
CBS.addElement('audio', CBS_AudioElement);