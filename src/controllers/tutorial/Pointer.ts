import { Easing, Tween } from "@tweenjs/tween.js";
import { Point } from "pixi.js";
import { TimeSkipper } from "../../utils/TimeSkipper";

export class Pointer {
    private leftPointer: HTMLDivElement = document.createElement('div');
    private topPointer: HTMLDivElement = document.createElement('div');
    private rightPointer: HTMLDivElement = document.createElement('div');
    private bottomPointer: HTMLDivElement = document.createElement('div');

    private pointers = [
        this.leftPointer, this.topPointer, this.rightPointer, this.bottomPointer
    ];

    constructor() {
        this.setup(this.leftPointer);
        this.leftPointer.style.width = '0px';
        this.leftPointer.style.height = '100vh';

        this.setup(this.topPointer);
        this.topPointer.style.height = '0px';
        this.topPointer.style.width = '100vw';

        this.setup(this.rightPointer);
        this.rightPointer.style.width = '100vw';
        this.rightPointer.style.height = '100vh';
        this.rightPointer.style.left = `${window.innerWidth}px`;

        this.setup(this.bottomPointer);
        this.bottomPointer.style.height = '100vh';
        this.bottomPointer.style.width = '100vw';
        this.bottomPointer.style.top = `${window.innerHeight}px`;
    }

    public set visible(value: boolean) {
        for (const pointer of this.pointers) {
            pointer.style.opacity = `${value ? '0.15' : '0'}`;
        }
    }

    public async destroy() {
        const duration = 1500;
        const tweenProvider = {
            opacity: 0.15
        };

        new Tween(tweenProvider)
            .to({
                opacity: 0
            }, duration)
            .easing(Easing.Quadratic.Out)
            .onUpdate(() => {
                this.leftPointer.style.opacity = `${tweenProvider.opacity}`;
                this.topPointer.style.opacity = `${tweenProvider.opacity}`;
                this.rightPointer.style.opacity = `${tweenProvider.opacity}`;
                this.bottomPointer.style.opacity = `${tweenProvider.opacity}`;
            })
            .start();

        await new TimeSkipper(duration).execute();

        this.leftPointer.remove();
        this.topPointer.remove();
        this.rightPointer.remove();
        this.bottomPointer.remove();
    }

    public movePointer(tl: Point, br: Point, duration: number) {

        const tweenProvider: {
            left: number,
            top: number,
            right: number,
            bottom: number
        } = {
            left: parseInt(this.leftPointer.style.width),
            top: parseInt(this.topPointer.style.height),
            right: parseInt(this.rightPointer.style.left),
            bottom: parseInt(this.bottomPointer.style.top)
        };

        new Tween(tweenProvider)
            .to({
                left: tl.x,
                top: tl.y,
                right: br.x,
                bottom: br.y
            }, duration)
            .easing(Easing.Quadratic.Out)
            .onUpdate(() => {
                this.leftPointer.style.width = `${tweenProvider.left}px`;
                this.topPointer.style.height = `${tweenProvider.top}px`;
                this.rightPointer.style.left = `${tweenProvider.right}px`;
                this.bottomPointer.style.top = `${tweenProvider.bottom}px`;
            })
            .start();

    }

    private setup(pointer: HTMLDivElement) {
        pointer.style.position = 'absolute';
        pointer.style.backgroundColor = 'black';
        pointer.style.opacity = '0.15';
        pointer.style.userSelect = 'none';
        pointer.style.pointerEvents = 'none';
        pointer.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;

        pointer.style.left = '0px';
        pointer.style.top = '0px';

        document.body.appendChild(pointer);
    }
}