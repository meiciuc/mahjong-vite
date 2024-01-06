import { Container, Resource, Sprite, Texture } from "pixi.js";
import { PathViewHelper } from "../view/PathViewHelper";
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

    private async setupRedParticleCanvas() {
        const particle = new Container();
        const sprite = new Sprite(PathViewHelper.getParticleTexture(Config.PARTICLE_KEY));
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