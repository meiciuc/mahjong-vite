import { stageService } from '../core/services/StageService';
import { BaseController } from './BaseController';

export class PreloaderController extends BaseController {
    destroy(): void {
        this.getPreloader()?.remove();
        stageService.updateSignal.remove(this.update);
    }

    protected async doExecute() {
        stageService.updateSignal.add(this.update);
    }

    private update = () => {
        const script = this.getScript();

        let preloaded = parseFloat(script?.getAttribute('preloaded'));
        preloaded += .1;
        preloaded = Math.min(preloaded, 100);

        script?.setAttribute('preloaded', `${preloaded}`);

        if (preloaded === 100) {
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
