import { Engine, NodeList, System } from "@ash.ts/ash";
import { GameStateEnum } from "../../model/GameModel";
import { GameNode } from "../game/nodes/GameNode";

export class GameTimerSystem extends System {
    private game?: NodeList<GameNode>;

    addToEngine(engine: Engine): void {
        this.game = engine.getNodeList(GameNode);
    }

    removeFromEngine(_engine: Engine): void {
        this.game = undefined;
    }

    update(time: number): void {
        if (this.game.head.game.model.data.gameState === GameStateEnum.CLICK_WAIT) {
            this.game.head.game.model.data.gameAge = Math.max(this.game.head.game.model.data.gameAge - time, 0);
        }
    }
}