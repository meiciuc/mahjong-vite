import { Assets, Container, Sprite } from "pixi.js";
import { Animatable } from "../ecs/animation/components/Animatable";
import { Config } from "../Config";

class Particle {
    private static count = 0;

    public id = Particle.count++;
    constructor(
        public sprite: Sprite,
        public age: number,
    ) {}
}

export class PathAnimatedLikeSnakeView extends Container implements Animatable {
    private timeFactor = 4;
    private lastTime = 0;
    private particleScale = 0.2;
    private readonly age = .1;

    private particles: Map<number, Particle> = new Map();

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
            sprite.tint = Config.PATH_COLOR;
            sprite.position.x = point.x;
            sprite.position.y = point.y;
            sprite.scale.set(this.particleScale);
            this.addChild(sprite);

            const particle = new Particle(sprite, this.age);
            this.particles.set(particle.id, particle);
        }
    }

    animate(time: number): void {
        if (this.lastTime < 1) {
            const t = Math.min(1, this.lastTime + time * this.timeFactor);
            this.draw(this.lastTime, t);
            this.lastTime = t;
        }
        

        this.particles.forEach((particle, id) => {
            particle.age -= time;
            particle.sprite.alpha = particle.age * 10;
            particle.sprite.scale.set(0.2 * particle.age / this.age)
            if (particle.age < 0) {
                particle.sprite.destroy();
                this.particles.delete(id);
            }
        })
    }
}