import { stageService } from '../core/services/StageService';
import { BaseController } from './BaseController';
import { Assets } from 'pixi.js';
import { Config } from '../Config';
import { Localization } from '../utils/Localization';
import WebFont from 'webfontloader';

export class PreloaderController extends BaseController {
    private scaled = 0;
    private preloaded = 0;

    destroy(): void {
        this.getPreloader()?.remove();
        stageService.updateSignal.remove(this.update);
    }

    protected async doExecute() {
        await this.loadLanguage();
        await this.loadFonts();

        stageService.updateSignal.add(this.update);

        await this.loadAssest();
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

    async loadAssest() {
        this.preloaded = 0;
        await Assets.load([
            `./assets/${Config.ASSETST_ICONS_VERSION}/icons_atlas.json`,
            `./assets/particle.png`
        ], (value: number) => {
            this.preloaded = value;
        });
    }

    async loadLanguage() {
        return Localization.setLanguage('ru');
    }

    async loadFonts() {
        return new Promise((resolve) => {
            WebFont.load({
                custom: {
                    families: [
                        'Inter-SemiBold',
                    ],
                },
                timeout: 500,
                active: () => {
                    resolve(true);
                },
            });
        })
            .catch((error: Error) => {
                console.log('Error: ', error);
            })
            .finally(() => {
                return Promise.resolve(true);
            });
    }

    private getPreloader() {
        return document.querySelector('.screen');
    }

    private getScript() {
        return document.querySelector('#preloader');
    }
}
