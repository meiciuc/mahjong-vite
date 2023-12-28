import { Howl, HowlOptions, Howler } from "howler";

class SoundService {

    private map: { [key: string]: Howl } = {};

    constructor() {
        Howler.volume(0.3);
    }

    register(key: string, options: HowlOptions) {
        this.map[key] = new Howl(options);
    }

    play(key: string) {
        const howl = this.map[key];
        if (!howl) {
            return;
        }
        howl.play();
    }

    mute(value: boolean) {
        Howler.mute(value);
    }
}

export const soundService = new SoundService();