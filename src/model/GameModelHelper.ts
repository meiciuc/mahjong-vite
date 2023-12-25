import { dataService } from "../core/services/DataService";
import { Languages } from "../utils/Localization";
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

    static getGameTotalScore() {
        const gameModel = dataService.getRootModel<GameModel>();
        return gameModel.data.gameTotalScore;
    }

    static setGameTotalScore(value: number) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.gameTotalScore = value;
    }

    static getGameCurrentScore() {
        const gameModel = dataService.getRootModel<GameModel>();
        return gameModel.data.gameCurrentScore;
    }

    static setGameCurrentScore(value: number) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.gameCurrentScore = value;
    }

    static createModel() {
        dataService.config<GameModel>({
            appState: AppStateEnum.NONE,
            gameState: GameStateEnum.NONE,
            gameLevel: 0,
            gameTotalScore: 0,
            gameCurrentScore: 0,
            gameStateTime: 0,
            gameMaxTime: 0,
            helpsCount: 3,

            icons: [],
            maxGridItems: 0,
            pause: false,
            language: Languages.en,
        });
    }

    static initModel(gridWidth: number, gridHeight: number, gameMaxTime: number) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.maxGridItems = gridWidth * gridHeight;

        gameModel.data.helpsCount = 3;
        gameModel.data.gameStateTime = 0;
        gameModel.data.gameCurrentScore = 0;

        gameModel.data.gameMaxTime = gameMaxTime;
    }

    static resetGameModelForNextLevel() {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.gameLevel++;
    }
}