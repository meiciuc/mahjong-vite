import { Container, Resource, Sprite, Texture } from "pixi.js";
import { Config } from "../Config";
import easingsFunctions from "../core/utils/easingsFunctions";
import { Animatable } from "../ecs/animation/components/Animatable";
import { assetsService } from "../services/AssetsService";

export class PathAnimatedAroundTileView extends Container implements Animatable {

    private currentTime = 0;
    private currentPathTime = 0;
    private easing = easingsFunctions.easeOutSine;

    public svg = Config.PATH_TILE_SVG;
    private path = this.svg.querySelector('path');
    private totalLength = this.path.getTotalLength();
    private k = 1 / Math.ceil(this.totalLength);

    private canvasContext: CanvasRenderingContext2D;
    private canvasTexture: Texture<Resource>;

    private finished = false;

    constructor(private duration = .5) {
        super();
        this.setupCanvas();
    }

    protected getPathBounding() {
        return { x: Config.ICON_IMAGE_WIDTH, y: Config.ICON_IMAGE_HEIGHT };
    }

    private async setupCanvas() {
        const { canvasTexture, canvasContext } = assetsService.getPathAnimatedAroundTileViewTexturePoolElement();
        this.canvasTexture = canvasTexture;
        this.canvasContext = canvasContext;

        this.addChild(new Sprite(canvasTexture));

        // HACK i not undenstand
        this.scale.set(.8);
    }

    private draw(from: number, to: number) {
        let time = from;
        while (time < to) {
            const point = this.path.getPointAtLength(time * this.totalLength);
            time += this.k;

            this.canvasContext.drawImage(this.particleElement, point.x, point.y);
        }
        this.canvasTexture.update();
    }

    animate(time: number): void {
        if (this.finished) {
            return;
        }

        this.currentTime += time;

        const t = this.easing(this.currentTime / this.duration);
        this.draw(this.currentPathTime, t);
        this.currentPathTime = t;

        if (this.currentPathTime >= 1) {
            this.finished = true;
        }
    }

    private get particleElement() {
        return assetsService.redParticleCanvas;
    }
}