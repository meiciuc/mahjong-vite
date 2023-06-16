import { Graphics } from 'pixi.js';
import { Config } from '../Config';

export class TileHelpEffectView extends Graphics {
    constructor() {
        super();
        const lineWidth = 10;
        this.lineStyle({ width: lineWidth, color: 0xff0000 });

        this.moveTo(lineWidth / 2, lineWidth);
        this.lineTo(Config.ICON_IMAGE_WIDTH - lineWidth, lineWidth);
        this.lineTo(Config.ICON_IMAGE_WIDTH - lineWidth, Config.ICON_IMAGE_WIDTH - lineWidth);
        this.lineTo(lineWidth, Config.ICON_IMAGE_WIDTH - lineWidth);
        this.lineTo(lineWidth, lineWidth / 2);
    }
}
