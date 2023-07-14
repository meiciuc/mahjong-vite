import { Assets, Container, Sprite } from "pixi.js";
import { Animatable } from "../ecs/animation/components/Animatable";
import { Config } from "../Config";
import easingsFunctions from "../core/utils/easingsFunctions";

class Particle {
    private static count = 0;

    public id = Particle.count++;
    constructor(
        public sprite: Sprite,
        public age: number,
    ) {}
}

export class PathAnimatedLikeSnakeView extends Container implements Animatable {
    private currentTime = 0;
    private currentPathTime = 0;
    private particleScale = 0.2;
    private easing = easingsFunctions.easeOutExpo;
    private readonly age = .2;

    private particles: Map<number, Particle> = new Map();

    constructor(public svg: SVGElement, private duration = .5) {
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
        this.currentTime += time;
        const t = this.easing(this.currentTime / this.duration);
        if (this.currentPathTime < 1) {
            this.draw(this.currentPathTime, t);
            this.currentPathTime = t;
        }

        // if (this.currentPathTime < 1) {
        //     const t = Math.min(1, this.currentPathTime + time * this.timeFactor);
        //     this.draw(this.currentPathTime, t);
        //     this.currentPathTime = t;
        // }
        

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