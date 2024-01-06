import { Container, Text } from "pixi.js";
import { Animatable } from "../ecs/animation/components/Animatable";
import { Easing, Tween } from "@tweenjs/tween.js";


export class ScoreEffectView extends Container implements Animatable {

    private static texts: { [key: string]: Text } = {};

    private tweenProvider = { alpha: 1, y: 0, scale: 1 };
    private text: Text;

    constructor(value: number) {
        super();

        this.interactive = false;
        this.interactiveChildren = false;

        this.text = this.getText(value);

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

    private getText(value: number) {
        const str = `${value > 0 ? '+' : ''}${value}`;
        let text = ScoreEffectView.texts[str];

        if (!text) {
            text = new Text(str, {
                fontFamily: 'Arial',
                fontSize: 100,
                fill: value > 0 ? 0xff0000 : 0x0000ff,
                align: 'center',
            });
            ScoreEffectView.texts[str] = text;
        }

        return text;
    }
}