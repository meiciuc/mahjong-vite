import { Assets, Container, Sprite } from "pixi.js";
import { Animatable } from "../ecs/animation/components/Animatable";
import { Config } from "../Config";
import easingsFunctions from "../core/utils/easingsFunctions";

function createPath() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svgPath.setAttribute('style', "fill: none; stroke: #fff; stroke-width: 1");
    
    svg.appendChild(svgPath);

    const w = Config.ICON_IMAGE_WIDTH * .95;
    const h = Config.ICON_IMAGE_HEIGHT * .95;
    const r = Math.floor((Config.ICON_IMAGE_WIDTH + Config.ICON_IMAGE_HEIGHT) / 2 * .25);
    const d = `M ${r} ${0} L ${w - r} ${0} Q ${w} ${0} ${w} ${r} L ${w} ${h - r} Q ${w} ${h} ${w - r} ${h} L ${r} ${h} Q ${0} ${h} ${0} ${h - r} L ${0} ${r} Q ${0} ${0} ${r} ${0}`;
    svgPath.setAttribute('d', d);
    return svg;
}

export class PathAnimatedAroundTileView extends Container implements Animatable {
    private static svg: SVGElement;
    private svg: SVGElement;
    private currentTime = 0;
    private currentPathTime = 0;
    private particleScale = 0.2;
    private easing = easingsFunctions.easeOutSine;

    constructor(private duration = .5) {
        super();
        if (!PathAnimatedAroundTileView.svg) {
            PathAnimatedAroundTileView.svg = createPath();
        }
        this.svg = PathAnimatedAroundTileView.svg;
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