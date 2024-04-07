import { ParticleContainer, Sprite } from "pixi.js";
import { Config } from "../Config";
import { assetsService } from "../services/AssetsService";

export class PathTileToggleView extends ParticleContainer {
    private color = Config.PATH_SELECT_COLOR;

    constructor() {
        super();
        this.draw();
    }

    private async draw() {
        const texture = await assetsService.getTileToggleTexture(Config.PARTICLE_KEY);
        const sprite = new Sprite(texture);
        sprite.scale.set(0.8);
        sprite.tint = this.color;
        // TODO sync
        try {
            this.addChild(sprite);
        } catch (error) { }
    }
}