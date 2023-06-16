import { Sprite, Texture } from 'pixi.js';

export class BaseButton extends Sprite {
    private isDown = false;
    private isOver = false;

    constructor(
        private _textureButton: Texture,
        private _textureButtonDown?: Texture,
        private _textureButtonOver?: Texture,
    ) {
        super();

        this.texture = this.textureButton;

        this.cursor = 'pointer';
        this.interactive = true;

        this.on('pointerdown', this.onButtonDown);
        this.on('pointerup', this.onButtonUp);
        this.on('pointerupoutside', this.onButtonUp);
        this.on('pointerover', this.onButtonOver);
        this.on('pointerout', this.onButtonOut);
    }

    private get textureButton() {
        return this._textureButton;
    }

    private get textureButtonDown() {
        return this._textureButtonDown ? this._textureButtonDown : this._textureButton;
    }

    private get textureButtonOver() {
        return this._textureButtonOver ? this._textureButtonOver : this._textureButton;
    }

    private onButtonDown = () => {
        this.isDown = true;
        this.texture = this.textureButtonDown;
        this.alpha = 1;
    };

    private onButtonUp = () => {
        this.isDown = false;
        this.texture = this.isOver ? this.textureButtonOver : this.textureButton;
    };

    private onButtonOver = () => {
        this.isOver = true;
        if (this.isDown) {
            return;
        }
        this.texture = this.textureButtonOver;
    };

    private onButtonOut = () => {
        this.isOver = false;
        if (this.isDown) {
            return;
        }
        this.texture = this.textureButton;
    };
}
