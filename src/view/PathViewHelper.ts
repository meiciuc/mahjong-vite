import { Container, Sprite, Texture } from "pixi.js";
import { Config } from "../Config";
import { stageService } from "../core/services/StageService";

export class PathViewHelper {
    private static textures: { [key: string]: Texture } = {};

    static getParticleTexture(key: string) {
        if (!PathViewHelper.textures[key]) {
            PathViewHelper.textures[key] = Texture.from(key);
        }
        return PathViewHelper.textures[key];
    }

    static async getTileToggleTexture(key: string) {
        const name = 'toggle' + key;
        if (!PathViewHelper.textures[name]) {
            const color = Config.PATH_SELECT_COLOR;
            const texture = Texture.from(key);
            const svg = Config.PATH_TILE_SVG;
            const path = svg.querySelector('path');
            const totalLength = path.getTotalLength();
            const length = Math.floor(totalLength / 2);
            const k = 1 / length;// 100 / length;
            let time = 0;
            const sprite = new Sprite();
            for (let i = 0; i < length; i++) {
                const point = path.getPointAtLength(time * totalLength);
                time += k;
                const particle = new Sprite(texture);
                particle.tint = color;
                particle.position.x = point.x / window.devicePixelRatio;
                particle.position.y = point.y / window.devicePixelRatio;
                particle.scale.set(Config.PARTICLE_SCALE / window.devicePixelRatio)
                sprite.addChild(particle);
            }
            const container = new Container();
            container.addChild(sprite);
            let image = await stageService.stage.renderer.plugins.extract.image(container);
            PathViewHelper.textures[name] = Texture.from(image);
        }
        return PathViewHelper.textures[name];
    }
}