import { Config } from "../Config";
import { dataService } from "../core/services/DataService";
import easingsFunctions from "../core/utils/easingsFunctions";
import { PointLike } from "../utils/point";
import { throwIfNull } from "../utils/throwIfNull";
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
        const gridSize = GameModelHelper.getGridSize();
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
                gameMaxTime: GameModelHelper.getGameMaxTime(),
                helpsCount: 3,
    
                icons: [],
                maxIconPaires: GameModelHelper.getGameMaxIconPaires(),
                gridWidth: gridSize.x,
                gridHeight: gridSize.y,
            });
        }
    }

    static resetGameModelForNextLevel() {
        const gameModel = dataService.getRootModel<GameModel>();
        const gridSize = GameModelHelper.getGridSize();

        if (Config.DEV_MODEL) {
            gameModel.data.gameLevel++;
            gameModel.data.helpsCount = 3;
            gameModel.data.gameStateTime = 0;
        } else {
            gameModel.data.gameLevel++;
            gameModel.data.helpsCount = 3;
            gameModel.data.gameStateTime = 0;

            gameModel.data.gridWidth = gridSize.x;
            gameModel.data.gridHeight = gridSize.y;
            gameModel.data.gameMaxTime = GameModelHelper.getGameMaxTime();
            gameModel.data.maxIconPaires = GameModelHelper.getGameMaxIconPaires();
        }
    }

    static generateIconsQueue() {
        const model = throwIfNull(dataService.getRootModel<GameModel>().data);
        const gw = model.gridWidth;
        const gh = model.gridHeight;
        const currentLevel = model.gameLevel;
        const shift = 4;

        const iconsQueue = [];

        const pares = model.maxIconPaires;
        let maxc = pares * 2;
        let count = gw * gh;
        let index = currentLevel < shift ? 0 : currentLevel - shift;
        while (count > 0) {
            while (maxc > 0) {
                iconsQueue.push(index);
                maxc--;
                count--;
                if (count <= 0) {
                    break;
                }
            }    
            index = (index + 1) % model.icons.length;
            maxc = pares * 2;
        }

        shuffle(iconsQueue, `${Math.random()}`);

        return iconsQueue;
    }

    static getGridSize() {
        const model = dataService.getRootModel<GameModel>();
        const easing = easingsFunctions.easeOutQuad;

        const startA = 6;
        const endA = 15;
        const startB = 7;
        const endB = 26;

        const currentLevel = model ? model.data.gameLevel : 1;
        const scaleLevel = currentLevel / Config.MAX_GAME_LEVEL;
        
        let currentA = Math.floor(easing(scaleLevel) * (endA - startA) + startA);
        let currentB = Math.floor(easing(scaleLevel) * (endB - startB) + startB);

        if (currentA % 2 !== 0 && currentB % 2 !== 0) {
            currentA++;
        }

        if (Config.GAME_HEIGHT < Config.GAME_WIDTH) {
            const temp = currentA;
            currentA = currentB;
            currentB = temp;
        }

        return <PointLike>{x: currentA, y: currentB};
    }

    static getGameMaxTime() {
        const model = dataService.getRootModel<GameModel>();
        const easing = easingsFunctions.easeInOutBack;

        const startA = 8;
        const endA = 5;

        const currentLevel = model ? model.data.gameLevel : 1;
        const scaleLevel = currentLevel / Config.MAX_GAME_LEVEL;

        const currentA = Math.floor(easing(scaleLevel) * 2 * (endA - startA) + startA);

        return Math.floor(60 * currentA);
    }

    static getGameMaxIconPaires() {
        const model = dataService.getRootModel<GameModel>();
        const easing = easingsFunctions.easeOutQuad;

        const startA = 3;
        const endA = 4;

        const currentLevel = model ? model.data.gameLevel : 1;
        const scaleLevel = currentLevel / Config.MAX_GAME_LEVEL;

        const currentA = Math.round(easing(scaleLevel) * (endA - startA) + startA);

        return currentA;
    }
}