import { Easing, Tween } from "@tweenjs/tween.js";
import { Point } from "pixi.js";

export class Pointer {
    protected pointer: HTMLDivElement;
    constructor() {
        this.pointer = document.createElement('div');
        this.pointer.style.position = 'absolute';
        this.pointer.style.width = '100px';
        this.pointer.style.height = '100px';
        this.pointer.style.backgroundColor = 'red';
        this.pointer.style.opacity = '0.5';
        this.pointer.style.left = '300px';
        this.pointer.style.top = '300px';
        this.pointer.style.userSelect = 'none';
        this.pointer.style.pointerEvents = 'none';
        this.pointer.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;

        document.body.appendChild(this.pointer);
    }

    public destroy() {
        this.pointer.remove();
    }

    public set visible(value: boolean) {
        this.pointer.style.opacity = `${value ? '0.5' : '0'}`;
    }

    public movePointer(tl: Point, br: Point, duration: number) {
        if (!duration) {
            this.pointer.style.left = `${tl.x}px`;
            this.pointer.style.top = `${tl.y}px`;
            this.pointer.style.width = `${br.x - tl.x}px`;
            this.pointer.style.height = `${br.y - tl.y}px`;
        } else {
            const pointerBoundingBox = this.pointer.getBoundingClientRect();
            const tweenProvider: {
                left: number,
                top: number,
                width: number,
                height: number
            } = {
                left: pointerBoundingBox.x,
                top: pointerBoundingBox.y,
                width: pointerBoundingBox.width,
                height: pointerBoundingBox.height
            };

            new Tween(tweenProvider)
                .to({
                    left: tl.x,
                    top: tl.y,
                    width: br.x - tl.x,
                    height: br.y - tl.y
                }, duration)
                .easing(Easing.Quadratic.Out)
                .onUpdate(() => {
                    this.pointer.style.left = `${tweenProvider.left}px`;
                    this.pointer.style.top = `${tweenProvider.top}px`;
                    this.pointer.style.width = `${tweenProvider.width}px`;
                    this.pointer.style.height = `${tweenProvider.height}px`;
                })
                .start();
        }
    }
}