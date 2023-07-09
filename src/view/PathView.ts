import { Assets, Container, Sprite } from "pixi.js";

export class PathView extends Container {
    constructor(public svg: SVGElement) {
        super();
        this.draw();
    }

    private draw() {
        const texture = Assets.cache.get(`./assets/particle.png`);
        const path = this.svg.querySelector('path');
        const totalLength = path.getTotalLength();
        const length = Math.floor(totalLength / 2 );
        const k = 1 / length;// 100 / length;
        let time = 0;
        console.log(totalLength, length)
        for (let i = 0; i < length; i++) {
            const point = path.getPointAtLength(time * totalLength);
            time += k;
            const sprite = new Sprite(texture);
            sprite.position.x = point.x;
            sprite.position.y = point.y;
            sprite.scale.set(0.2)
            this.addChild(sprite);
        }
    }
}