import { Assets, Container, Sprite } from "pixi.js";
import { Animatable } from "../ecs/animation/components/Animatable";
import { Config } from "../Config";
import easingsFunctions from "../core/utils/easingsFunctions";

export class PathAnimatedAroundTileView extends Container implements Animatable {
    private svg = Config.PATH_TILE_SVG;
    private color = Config.PATH_HELP_COLOR;
    private currentTime = 0;
    private currentPathTime = 0;
    private particleScale = 0.2;
    private easing = easingsFunctions.easeOutSine;

    constructor(private duration = .5) {
        super();
    }

    private draw(from: number, to: number) {
        const texture = Assets.cache.get(`./assets/particle.png`);
        const path = this.svg.querySelector('path');
        const totalLength = path.getTotalLength();
        
        const length = Math.ceil(totalLength);
        const k = 1 / length;
        let time = from;
        while (time < to) {
            const prev = this.children[this.children.length - 1];
            const point = path.getPointAtLength(time * totalLength);
            time += k;
            
            if (prev && (Math.abs(prev.x - point.x) < 1 && Math.abs(prev.y - point.y) < 1)) {
                continue;
            }
            
            const sprite = new Sprite(texture);
            sprite.tint = this.color;
            sprite.position.x = point.x;
            sprite.position.y = point.y;
            sprite.scale.set(this.particleScale);
            this.addChild(sprite);
        }
    }

    animate(time: number): void {
        this.currentTime += time;
        const t = this.easing(this.currentTime / this.duration);
        if (this.currentPathTime >= 1) {
            return;
        }
        this.draw(this.currentPathTime, t);
        this.currentPathTime = t;
    }
}