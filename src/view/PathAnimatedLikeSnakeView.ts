import { ParticleContainer, Rectangle, Resource, Sprite, Texture } from "pixi.js";
import { Config } from "../Config";
import easingsFunctions from "../core/utils/easingsFunctions";
import { Animatable } from "../ecs/animation/components/Animatable";
import { assetsService } from "../services/AssetsService";

class Particle extends Sprite {
    isDead = false;
    constructor(
        public age: number,
        public tex: Texture<Resource>,
    ) {
        super(tex);
    }
}

export class PathAnimatedLikeSnakeView extends ParticleContainer implements Animatable {
    private currentTime = 0;
    private currentPathTime = 0;
    private particleScale = Config.PARTICLE_SCALE / window.devicePixelRatio * 1.3;
    private easing = easingsFunctions.easeInOutCirc;
    private particleAge = .3;

    private path: SVGPathElement;
    private totalLength: number;
    private k: number;

    private particles: Particle[] = [];
    private startRectangle: Rectangle;
    private finishRectangle: Rectangle;

    private color = Config.PATH_SELECT_COLOR;

    constructor(public svg: SVGElement, private duration = Config.PATH_LIKE_SNAKE_DURATION) {
        super((svg.querySelector('path').getTotalLength() || 500) * 2);
        this.setProperties({ rotation: false, position: false, vertices: false, uvs: false });
        this.particleAge = this.duration / 1.5;

        this.path = this.svg.querySelector('path');
        this.totalLength = this.path.getTotalLength();
        this.k = 1 / Math.ceil(this.totalLength);

        const size = Config.ICON_IMAGE_WIDTH;
        const startPoint = this.path.getPointAtLength(0);
        const finishPoint = this.path.getPointAtLength(this.totalLength);
        this.startRectangle = new Rectangle(startPoint.x - size / 2, startPoint.y - size / 2, size * .9, size * .9);
        this.finishRectangle = new Rectangle(finishPoint.x - size / 2, finishPoint.y - size / 2, size * .9, size * .9);
    }

    private draw(from: number, to: number) {
        let time = from;
        while (time < to) {
            const prev = this.children[this.children.length - 1];
            const point = this.path.getPointAtLength(time * this.totalLength);
            time += this.k;

            if (
                (prev && (Math.abs(prev.x - point.x) < 1 && Math.abs(prev.y - point.y) < 1))
                || this.startRectangle.contains(point.x, point.y)
                || this.finishRectangle.contains(point.x, point.y)
            ) {
                continue;
            }

            const particle = new Particle(this.particleAge, assetsService.getParticleTexture(Config.PARTICLE_KEY));
            particle.tint = this.color;
            particle.scale.set(this.particleScale);
            particle.position.x = point.x;
            particle.position.y = point.y;
            this.addChild(particle);

            this.particles.unshift(particle);
        }
    }

    animate(time: number): void {
        this.currentTime += time;
        const t = this.easing(this.currentTime / this.duration);
        if (this.currentPathTime < 1) {
            this.draw(this.currentPathTime, t);
            this.currentPathTime = t;
        }

        for (const particle of this.particles) {
            if (particle.isDead) {
                break;
            }
            particle.age -= time;
            particle.alpha = Math.max(0, particle.age / this.particleAge);

            if (particle.age < 0 && !particle.isDead) {
                particle.isDead = true;
            }
        }
    }
}