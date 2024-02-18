import { Container, Resource, Sprite, Texture } from "pixi.js";
import { Config } from "../Config";
import { stageService } from "../core/services/StageService";
import { throwIfNull } from "../utils/throwIfNull";

class PoolElement {
    constructor(
        public canvasTexture: Texture<Resource>,
        public canvasContext: CanvasRenderingContext2D,
    ) { }
}

class AssetsService {

    private textures: { [key: string]: Texture } = {};
    private pathAnimatedAroundTileViewTexturePool: PoolElement[] = [];
    public redParticleCanvas: HTMLCanvasElement;

    async init() {
        await this.setupRedParticleCanvas();
        await this.setupPathAnimatedAroundTileViewTexturePool();

        return Promise.resolve();
    }

    getPathAnimatedAroundTileViewTexturePoolElement() {
        const element = this.pathAnimatedAroundTileViewTexturePool.shift();
        element.canvasContext.clearRect(0, 0, element.canvasContext.canvas.width, element.canvasContext.canvas.height);
        element.canvasTexture.update();
        this.pathAnimatedAroundTileViewTexturePool.push(element);
        return element;
    }

    getParticleTexture(key: string) {
        if (!this.textures[key]) {
            this.textures[key] = Texture.from(key);
        }
        return this.textures[key];
    }

    getScoreTexture(value: number) {
        const str = `${value > 0 ? '+' : ''}${value}`;
        return this.textures[str] ? this.textures[str] : this.textures['0'];
    }

    async getTileToggleTexture(key: string) {
        const name = 'toggle' + key;
        if (!this.textures[name]) {
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
            this.textures[name] = Texture.from(image);
        }
        return this.textures[name];
    }

    private async setupRedParticleCanvas() {
        const particle = new Container();
        const sprite = new Sprite(this.getParticleTexture(Config.PARTICLE_KEY));
        sprite.tint = Config.PATH_HELP_COLOR;
        sprite.scale.set(Config.PARTICLE_SCALE / window.devicePixelRatio);
        particle.addChild(sprite);
        this.redParticleCanvas = await stageService.stage.renderer.plugins.extract.image(particle);
    }

    private async setupPathAnimatedAroundTileViewTexturePool() {
        for (let i = 0; i < 2; i++) {
            const resolution = window.devicePixelRatio;
            const canvas = document.createElement('canvas');

            const size = { x: Config.ICON_IMAGE_WIDTH, y: Config.ICON_IMAGE_HEIGHT };
            size.x *= resolution;
            size.y *= resolution;
            canvas.width = size.x;
            canvas.height = size.y;
            const canvasTexture = Texture.from(canvas);

            const canvasContext = throwIfNull(canvas.getContext('2d'));

            const element = new PoolElement(canvasTexture, canvasContext);

            this.pathAnimatedAroundTileViewTexturePool.push(element);
        }
        return Promise.resolve();
    }
}

export const assetsService = new AssetsService();