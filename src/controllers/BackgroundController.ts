import { Sprite, Texture } from 'pixi.js';
import { Config } from '../Config';
import { stageService } from '../core/services/StageService';
import { LAYERS } from '../GameLayers';
import { BaseController } from './BaseController';

export class BackgroundController extends BaseController {
    private view: Sprite | undefined;

    destroy(): void {
        stageService.resizeSignal.remove(this.resize);
        if (this.view) {
            this.view.destroy();
            this.view = undefined;
        }
    }

    protected async doExecute() {
        this.view = new Sprite(Texture.WHITE);
        this.view.tint = Config.GRID_BaCKGROUND_COLOR;
        stageService.getLayer(LAYERS.BACKGROUND).addChild(this.view);

        this.resize();

        stageService.resizeSignal.add(this.resize);
    }

    private resize = () => {
        if (!this.view) {
            return;
        }

        this.view.width = stageService.width;
        this.view.height = stageService.height;
    };
}
