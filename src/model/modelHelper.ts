import { dataService } from "../core/services/DataService";
import { AppStateEnum, GameModel } from "./GameModel";

export class ModelHelper {
    static setApplicationState(value: AppStateEnum) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.appState = value;
    }

    static getGameState() {
        const gameModel = dataService.getRootModel<GameModel>();
        return gameModel.data.gameState;
    }
}