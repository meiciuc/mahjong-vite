import { Howl, HowlOptions } from "howler";

class SoundService {

    private map: { [key: string]: Howl } = {};

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
}

export const soundService = new SoundService();