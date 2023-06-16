import { Container, DisplayObject } from 'pixi.js';

export class Display {
    constructor(public view: DisplayObject, public addToParent: Container) {}
}
