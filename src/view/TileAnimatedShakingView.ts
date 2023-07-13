import { Animatable } from "../ecs/animation/components/Animatable";

export class TileAnimatedShakingView implements Animatable {

    startX = 0;
    startY = 0;
    currentX = 0;
    currentY = 0;

    deltaX = 5;
    deltaY = 5;

    age = 1;

    animate(_time: number): void {
        this.currentX = this.startX + Math.random() * this.deltaX * (Math.random() > 0.5 ? 1 : -1);
        this.currentY = this.startY + Math.random() * this.deltaY * (Math.random() > 0.5 ? 1 : -1);
    }
}