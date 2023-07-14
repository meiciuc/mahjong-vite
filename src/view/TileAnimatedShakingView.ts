import easingsFunctions from "../core/utils/easingsFunctions";
import { Animatable } from "../ecs/animation/components/Animatable";

export class TileAnimatedShakingView implements Animatable {

    startX = 0;
    startY = 0;
    currentX = 0;
    currentY = 0;

    deltaX = 5;
    deltaY = 5;

    private duration: number;
    private time = 0;
    private easing = easingsFunctions.easeOutSine;

    constructor(public age = .5) {
        this.duration = age;
    }

    animate(time: number): void {
        this.time += time;
        const t = this.time / this.duration;
        
        this.currentX = this.startX + (Math.random() * this.deltaX * (Math.random() > 0.5 ? 1 : -1)) * this.easing(t);
        this.currentY = this.startY + (Math.random() * this.deltaY * (Math.random() > 0.5 ? 1 : -1)) * this.easing(t);
    }
}