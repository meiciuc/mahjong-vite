import { ParticleContainer, Sprite } from "pixi.js";
import { Config } from "../Config";
import { PathViewHelper } from "./PathViewHelper";

export class PathTileToggleView extends ParticleContainer {
    private color = Config.PATH_SELECT_COLOR;

    constructor() {
        super();
        this.draw();
    }

    private async draw() {
        const texture = await PathViewHelper.getTileToggleTexture('./assets/particle.png');
        const sprite = new Sprite(texture);
        sprite.scale.set(0.8);
        sprite.tint = this.color;
        this.addChild(sprite);
    }
}