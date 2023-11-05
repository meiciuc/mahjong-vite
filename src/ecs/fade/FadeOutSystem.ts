import { Engine, System } from "@ash.ts/ash";
import { stageService } from "../../core/services/StageService";
import { LAYERS } from "../../GameLayers";

export class FadeOutSystem extends System {
    private endAlpha = 0;

    addToEngine(_engine: Engine): void {

    }

    removeFromEngine(_engine: Engine): void {

    }

    update(time: number): void {
        const game = stageService.getLayer(LAYERS.GAME);
        if (game.alpha === this.endAlpha) {
            return;
        }

        game.alpha = Math.max(game.alpha - time * game.alpha * 10, this.endAlpha);
        stageService.getLayer(LAYERS.EFFECTS).alpha = game.alpha;
    }

}