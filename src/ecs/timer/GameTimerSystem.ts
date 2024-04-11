import { Engine, NodeList, System } from "@ash.ts/ash";
import { BoosterType, GameModel, GameStateEnum } from "../../model/GameModel";
import { GameNode } from "../game/nodes/GameNode";
import { VueServiceSignals, vueService } from "../../vue/VueService";
import { GameModelHelper } from "../../model/GameModelHelper";
import { saveDataService } from "../../services/SaveDataService";
import { dataService } from "../../core/services/DataService";

export class GameTimerSystem extends System {
    private timeBoosterClicked = false;
    private game?: NodeList<GameNode>;

    addToEngine(engine: Engine): void {
        this.game = engine.getNodeList(GameNode);

        vueService.signalDataBus.on(this.handleSignalDataBus);
    }

    removeFromEngine(_engine: Engine): void {
        this.game = undefined;

        vueService.signalDataBus.off(this.handleSignalDataBus);
    }

    update(time: number): void {
        if (this.game.head.game.model.data.gameState === GameStateEnum.CLICK_WAIT) {
            this.game.head.game.model.data.gameAge = Math.max(this.game.head.game.model.data.gameAge - time, 0);
        }

        if (this.timeBoosterClicked) {
            this.timeBoosterClicked = false;
            this.addTime();
        }
    }

    private handleSignalDataBus = (data: VueServiceSignals) => {
        if (data !== VueServiceSignals.BoosterTimeClick) {
            return;
        }

        if (GameModelHelper.getBooster(BoosterType.TIME).current <= 0) {
            return;
        }

        this.timeBoosterClicked = true;
    };

    private addTime() {
        const boosters = GameModelHelper.getBooster(BoosterType.TIME)?.current;
        if (!boosters) {
            return;
        }

        dataService.getRootModel<GameModel>().data.gameAge += 60;

        GameModelHelper.setBooster(BoosterType.TIME, Math.max(0, boosters - 1));
        saveDataService.saveData();
    }
}