import { Texture } from "pixi.js";

export class PathViewHelper {
    private static textures: { [key: string]: Texture } = {};

    static getParticleTexture(key: string) {
        if (!PathViewHelper.textures[key]) {
            PathViewHelper.textures[key] = Texture.from(key);
        }
        return PathViewHelper.textures[key];
    }
}