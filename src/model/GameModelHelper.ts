import { Config } from "../Config";
import { dataService } from "../core/services/DataService";
import { shuffle } from "../utils/utils";
import { AppStateEnum, GameModel, GameStateEnum } from "./GameModel";

export class GameModelHelper {
    static setApplicationState(value: AppStateEnum) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.appState = value;
    }

    static getApplicationState() {
        const gameModel = dataService.getRootModel<GameModel>();
        return gameModel.data.appState;
    }

    static setGameState(value: GameStateEnum) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.gameState = value;
    }

    static getGameState() {
        const gameModel = dataService.getRootModel<GameModel>();
        return gameModel.data.gameState;
    }

    static getHelpsCount() {
        const gameModel = dataService.getRootModel<GameModel>();
        return gameModel.data.helpsCount;
    }

    static setHelpsCount(value: number) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.helpsCount = value;
    }

    static getGameLevel() {
        const gameModel = dataService.getRootModel<GameModel>();
        return gameModel.data.gameLevel;
    }

    static setGameLevel(value: number) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.gameLevel = value;
    }

    static getGameScore() {
        const gameModel = dataService.getRootModel<GameModel>();
        return gameModel.data.gameScore;
    }

    static setGameScore(value: number) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.gameScore = value;
    }

    static createModel() {
        if (Config.DEV_MODEL) {
            dataService.config<GameModel>({
                appState: AppStateEnum.NONE,
                appStateTime: 0,
                gameState: GameStateEnum.NONE,
                gameLevel: 0,
                gameScore: 0,
                gameStateTime: 0,
                gameMaxTime: 60 * 1,
                helpsCount: 3,
    
                icons: [],
                maxIconPaires: 2,
                gridWidth: 4,
                gridHeight: 5,
            });
        } else {
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
    }

    static resetGameModelForNextLevel() {
        const gameModel = dataService.getRootModel<GameModel>();

        if (Config.DEV_MODEL) {
            gameModel.data.gameLevel++;
            gameModel.data.helpsCount = 3;
            gameModel.data.gameStateTime = 0;
        } else {
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

    static generateIconsQueue() {
        const model = dataService.getRootModel<GameModel>().data;
        const gw = model.gridWidth;
        const gh = model.gridHeight;

        const iconsQueue = [];

        const pares = model.maxIconPaires;
        let maxc = pares * 2;
        let count = gw * gh;
        let index = 0;
        while (count > 0) {
            while (maxc > 0) {
                iconsQueue.push(index);
                maxc--;
                count--;
                if (count <= 0) {
                    break;
                }
            }    
            index++;
            maxc = pares * 2;
        }

        shuffle(iconsQueue, 'hello.');

        return iconsQueue;
    }
}