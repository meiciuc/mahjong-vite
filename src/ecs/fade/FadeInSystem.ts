import { Engine, System } from "@ash.ts/ash";
import { stageService } from "../../core/services/StageService";
import { LAYERS } from "../../GameLayers";
import { Easing, Tween } from "@tweenjs/tween.js";

export class FadeInSystem extends System {
    private tweenProvider: { value: number } = { value: 0 };

    addToEngine(_engine: Engine): void {
        this.tweenProvider.value = stageService.getLayer(LAYERS.GAME).alpha;
        new Tween(this.tweenProvider)
            .to({ value: 1 }, 300)
            .easing(Easing.Quadratic.Out)
            .start();
    }

    removeFromEngine(_engine: Engine): void {

    }

    update(_time: number): void {
        const game = stageService.getLayer(LAYERS.GAME);
        if (game.alpha !== this.tweenProvider.value) {
            game.alpha = this.tweenProvider.value;
        }
    }
}