import { dataService } from "../core/services/DataService";
import { AppStateEnum, GameModel, GameStateEnum } from "./GameModel";

export class GameLevelHelper {
    createModel() {
        dataService.config<GameModel>({
            appState: AppStateEnum.NONE,
            appStateTime: 0,
            gameState: GameStateEnum.NONE,
            gameLevel: 0,
            gameScore: 0,
            gameStateTime: 0,
            gameMaxTime: 60 * 8,
            helpsCount: 3,

            icons: [],
            maxIconPaires: 3,
            gridWidth: 4,
            gridHeight: 5,
        });
    }

    nextLevel() {
        const gameModel = dataService.getRootModel<GameModel>();

        gameModel.data.gameLevel++;
        gameModel.data.helpsCount = 3;
        gameModel.data.gameStateTime = 0;
        
        if (gameModel.data.gameLevel % 2 === 0) {
            gameModel.data.gameMaxTime = 60 * 6;
        } else {
            gameModel.data.maxIconPaires = Math.max(2, Math.floor(4 - gameModel.data.gameLevel / 2));
        }
    }
}