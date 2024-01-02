import { Container, Sprite, Texture } from "pixi.js";
import { Config } from "../Config";
import easingsFunctions from "../core/utils/easingsFunctions";
import { Animatable } from "../ecs/animation/components/Animatable";
import { PathViewHelper } from "./PathViewHelper";
import { stageService } from "../core/services/StageService";

export class PathAnimatedAroundTileViewNew extends Container implements Animatable {
    private svg = Config.PATH_TILE_SVG;
    private color = Config.PATH_HELP_COLOR;
    private currentTime = 0;
    private currentPathTime = 0;
    private particleScale = 0.2;
    private easing = easingsFunctions.easeOutSine;

    private path = this.svg.querySelector('path');
    private totalLength = this.path.getTotalLength();
    private k = 1 / Math.ceil(this.totalLength) * 2;
    private texture = PathViewHelper.getParticleTexture(`./assets/particle.png`);

    private canvas?: HTMLCanvasElement;
    private canvasCyrcle?: HTMLCanvasElement;
    private canvasTexture?: Texture;

    private finished = false;

    constructor(private duration = .5) {
        super();
        this.setupCanvas();
    }

    protected getPathBounding() {
        return { x: Config.ICON_IMAGE_WIDTH, y: Config.ICON_IMAGE_HEIGHT };
    }

    private async setupCanvas() {
        this.canvas = document.createElement('canvas');

        const size = this.getPathBounding();
        this.canvas.width = size.x;
        this.canvas.height = size.y;

        const particle = new Container();
        const sprite = new Sprite(this.texture);
        sprite.tint = this.color;
        sprite.scale.set(this.particleScale);
        particle.addChild(sprite);
        this.canvasCyrcle = await stageService.stage.renderer.plugins.extract.image(particle);

        this.canvasTexture = Texture.from(this.canvas);

        this.addChild(new Sprite(this.canvasTexture));

        document.body.appendChild(this.canvas)
    }

    private draw(from: number, to: number) {
        const ctx = this.canvas?.getContext('2d');
        if (!ctx || !this.canvasCyrcle) {
            return;
        }

        let time = from;
        while (time < to) {
            const point = this.path.getPointAtLength(time * this.totalLength);
            time += this.k;

            ctx.drawImage(this.canvasCyrcle, point.x, point.y);
        }
    }

    animate(time: number): void {
        if (this.finished || !this.canvasTexture) {
            return;
        }

        this.currentTime += time;

        const t = this.easing(this.currentTime / this.duration);
        this.draw(this.currentPathTime, t);
        this.currentPathTime = t;

        if (this.currentPathTime >= 1) {
            this.finished = true;
        }

        this.canvasTexture.update();
    }
}