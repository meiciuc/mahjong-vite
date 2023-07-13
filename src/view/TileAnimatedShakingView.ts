import { Animatable } from "../ecs/animation/components/Animatable";

export class TileAnimatedShakingView implements Animatable {

    startX = 0;
    startY = 0;
    currentX = 0;
    currentY = 0;

    deltaX = 5;
    deltaY = 5;

    constructor(public age = 1) {
        this.duration = age;
    }

    private duration: number;
    private time = 0;

    animate(time: number): void {
        this.time += time;
        const t = this.time / this.duration;
        
        this.currentX = this.startX + (Math.random() * this.deltaX * (Math.random() > 0.5 ? 1 : -1)) * this.easeInOutQuad(t);
        this.currentY = this.startY + (Math.random() * this.deltaY * (Math.random() > 0.5 ? 1 : -1)) * this.easeInOutQuad(t);
    }

    private easeInOutQuad = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}