import { Config } from "../Config";
import { dataService } from "../core/services/DataService";
import easingsFunctions from "../core/utils/easingsFunctions";
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
        dataService.config<GameModel>({
            appState: AppStateEnum.NONE,
            appStateTime: 0,
            gameState: GameStateEnum.NONE,
            gameLevel: 0,
            gameScore: 0,
            gameStateTime: 0,
            gameMaxTime: 0,
            helpsCount: 3,

            icons: [],
            maxIconPaires: 0,
            maxGridItems: 0,
        });
    }

    static initModel(gridWidth: number, gridHeight: number) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.maxGridItems = gridWidth * gridHeight;

        gameModel.data.helpsCount = 3;
        gameModel.data.gameStateTime = 0;

        gameModel.data.gameMaxTime = GameModelHelper.getGameMaxTime();
        gameModel.data.maxIconPaires = GameModelHelper.getGameMaxIconPaires();
    }

    static resetGameModelForNextLevel(gridWidth: number, gridHeight: number) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.gameLevel++;

        GameModelHelper.initModel(gridWidth, gridHeight);
    }

    static generateIconsQueue(gridWidth: number, gridHeight: number) {
        const model = throwIfNull(dataService.getRootModel<GameModel>().data);
        const gw = gridWidth;
        const gh = gridHeight;
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

    private static getGameMaxTime() {
        const model = dataService.getRootModel<GameModel>();
        return Math.floor(model.raw.maxGridItems * 2);
    }

    private static getGameMaxIconPaires() {
        const model = dataService.getRootModel<GameModel>();
        const easing = easingsFunctions.easeOutQuad;

        const startA = 3;
        const endA = 3;

        const currentLevel = model ? model.data.gameLevel : 1;
        const scaleLevel = currentLevel / Config.MAX_GAME_LEVEL;

        const currentA = Math.round(easing(scaleLevel) * (endA - startA) + startA);

        return currentA;
    }
}