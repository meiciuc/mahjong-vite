import { Container, Sprite } from "pixi.js";
import { Animatable } from "../ecs/animation/components/Animatable";
import { Easing, Tween } from "@tweenjs/tween.js";
import { assetsService } from "../services/AssetsService";


export class ScoreEffectView extends Container implements Animatable {

    private tweenProvider = { alpha: 1, y: 0, scale: 1 };
    private text: Sprite;

    constructor(value: number) {
        super();

        this.interactive = false;
        this.interactiveChildren = false;

        this.text = new Sprite(assetsService.getScoreTexture(value));

        this.addChild(this.text);

        new Tween(this.tweenProvider)
            .to({ alpha: 0, y: 150 * (value > 0 ? -1 : 1), scale: 2 }, 1000)
            .easing(Easing.Quadratic.InOut)
            .start();
    }

    animate(_time: number): void {
        this.text.y = this.tweenProvider.y;
        this.text.alpha = this.tweenProvider.alpha;
        this.text.scale.set(this.tweenProvider.scale);
    }
}