import { Signal1 } from '@ash.ts/ash';
import { stageService } from '../core/services/StageService';
import { BaseController } from './BaseController';

export class PreloaderController extends BaseController {
    private scaled = 0;
    private preloaded = 0;

    constructor(private signal: Signal1<number>) {
        super();
    }

    destroy(): void {
        this.getPreloader()?.remove();
        this.signal.remove(this.handleSignal);
        stageService.updateSignal.remove(this.update);
    }

    protected async doExecute() {
        this.signal.add(this.handleSignal);
        stageService.updateSignal.add(this.update);
    }

    private handleSignal = (value: number) => {
        this.preloaded = value;
    }

    private update = () => {
        function lerp(start, end, amt) {
            return (1 - amt) * start + amt * end
        }

        this.scaled = lerp(this.scaled, this.preloaded, 0.03);
        let value = this.scaled * 100;
        value = value > 99.9 ? 100 : value;

        const script = this.getScript();
        script?.setAttribute('preloaded', `${value}`);

        if (this.scaled > 0.9999) {
            this.complete();
        }
    }

    private getPreloader() {
        return document.querySelector('.screen');
    }

    private getScript() {
        return document.querySelector('#preloader');
    }
}
