import { Assets, Container, Rectangle, Sprite } from "pixi.js";
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
    private particleScale = 0.25;
    private easing = easingsFunctions.easeInOutCirc;
    private particleAge = .3;

    private particles: Map<number, Particle> = new Map();
    private masks: Rectangle[] = [];

    private color = Config.PATH_SELECT_COLOR;

    constructor(public svg: SVGElement, private duration = Config.PATH_LIKE_SNAKE_DURATION) {
        super();
        this.particleAge = this.duration / 1.5;

        const hitzone = Config.ICON_IMAGE_WIDTH * .9;
        const path = this.svg.querySelector('path');
        let point = path.getPointAtLength(0);
        this.masks.push(new Rectangle(point.x - hitzone / 2, point.y - hitzone / 2, hitzone, hitzone));
        point = path.getPointAtLength(path.getTotalLength());
        this.masks.push(new Rectangle(point.x - hitzone / 2, point.y - hitzone / 2, hitzone, hitzone));
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

            let cont = false;
            for (const rect of this.masks) {
                if (rect.contains(point.x, point.y)) {
                    cont = true;
                }
            }

            if (cont) {
                continue;
            }

            const sprite = new Sprite(texture);
            sprite.tint = this.color;
            sprite.position.x = point.x;
            sprite.position.y = point.y;
            this.addChild(sprite);

            const particle = new Particle(sprite, this.particleAge);
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

        this.particles.forEach((particle, id) => {
            particle.age -= time;
            particle.sprite.alpha = particle.age * 10;
            particle.sprite.scale.set(this.particleScale * particle.age / this.particleAge);
            if (particle.age < 0) {
                particle.sprite.destroy();
                this.particles.delete(id);
            }
        })
    }
}