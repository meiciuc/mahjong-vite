import { ParticleContainer, Sprite } from "pixi.js";
import { Config } from "../Config";
import easingsFunctions from "../core/utils/easingsFunctions";
import { Animatable } from "../ecs/animation/components/Animatable";
import { PathViewHelper } from "./PathViewHelper";

class Particle {
    private static count = 0;

    public id = Particle.count++;
    constructor(
        public sprite: Sprite,
        public age: number,
    ) { }
}

export class PathAnimatedLikeSnakeView extends ParticleContainer implements Animatable {
    private currentTime = 0;
    private currentPathTime = 0;
    private particleScale = 0.25;
    private easing = easingsFunctions.easeInOutCirc;
    private particleAge = .3;

    private texture = PathViewHelper.getParticleTexture(`./assets/particle.png`);
    private path: SVGPathElement;
    private totalLength: number;
    private k: number;

    private deltaDistance = 60;
    private finishPathTime: number;

    private particles: Map<number, Particle> = new Map();

    private color = Config.PATH_SELECT_COLOR;

    constructor(public svg: SVGElement, private duration = Config.PATH_LIKE_SNAKE_DURATION) {
        super();
        this.particleAge = this.duration / 1.5;

        this.path = this.svg.querySelector('path');
        this.totalLength = this.path.getTotalLength();
        this.k = 1 / Math.ceil(this.totalLength);

        this.currentPathTime = this.deltaDistance / this.totalLength;
        this.finishPathTime = 1 - this.currentPathTime;
    }

    private draw(from: number, to: number) {
        let time = from;
        let count = 0;
        while (time < to && time >= from) {
            const prev = this.children[this.children.length - 1];
            const point = this.path.getPointAtLength(time * this.totalLength);
            time += this.k;

            if (prev && (Math.abs(prev.x - point.x) < 1 && Math.abs(prev.y - point.y) < 1)) {
                continue;
            }

            // console.log((prev ? [Math.abs(prev.x - point.x), Math.abs(prev.y - point.y)] : ''), point)

            const sprite = new Sprite(this.texture);
            sprite.tint = this.color;
            sprite.scale.set(this.particleScale);
            sprite.position.x = point.x;
            sprite.position.y = point.y;
            this.addChild(sprite);

            const particle = new Particle(sprite, this.particleAge);
            this.particles.set(particle.id, particle);

            count++;
        }

        // console.log(count)
    }

    animate(time: number): void {
        this.currentTime += time;
        if (this.currentPathTime < this.finishPathTime) {
            const t = this.easing(this.currentTime / this.duration);
            this.draw(this.currentPathTime, t);
            this.currentPathTime = t;
        }

        this.particles.forEach((particle, id) => {
            particle.age -= time;
            particle.sprite.alpha = particle.age * 10;
            // particle.sprite.scale.set(this.particleScale * particle.age / this.particleAge);
            if (particle.age < 0) {
                particle.sprite.destroy();
                this.particles.delete(id);
            }
        })

        console.log(this.particles.size)
    }
}