import { Howl, HowlOptions } from "howler";

class SoundService {

    private map: { [key: string]: Howl } = {};

    register(key: string, options: HowlOptions) {
        this.map[key] = new Howl(options);
        console.log('this.register', key, this.map[key])
    }

    play(key: string) {
        const howl = this.map[key];

        console.log('play', key, howl)
        if (!howl) {
            return;
        }
        console.log('play 1')
        howl.play();
    }
}

export const soundService = new SoundService();