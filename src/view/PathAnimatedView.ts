import { Assets, Container, Sprite } from "pixi.js";
import { Animatable } from "../ecs/animation/components/Animatable";

export class PathAnimatedView extends Container implements Animatable {
    private timeFactor = 2;
    private lastTime = 0;
    private particleScale = 0.2;

    constructor(public svg: SVGElement) {
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
            const point = path.getPointAtLength(time * totalLength);
            time += k;
            const sprite = new Sprite(texture);
            sprite.position.x = point.x;
            sprite.position.y = point.y;
            sprite.scale.set(this.particleScale);
            this.addChild(sprite);
        }
    }

    animate(time: number): void {
        if (this.lastTime >= 1) {
            return;
        }
        time = Math.min(1, this.lastTime + time * this.timeFactor);
        this.draw(this.lastTime, time);
        this.lastTime = time;
    }
}