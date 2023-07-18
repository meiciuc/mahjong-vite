import { dataService } from "../core/services/DataService";
import { AppStateEnum, GameModel, GameStateEnum } from "./GameModel";

export class ModelHelper {
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

    static resetGameModelForNextLevel() {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.helpsCount = 3;
        gameModel.data.gameStateTime = 0;
        gameModel.data.gameLevel++;
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
            icons: [],
            appState: AppStateEnum.NONE,
            appStateTime: 0,
            gameState: GameStateEnum.NONE,
            gameLevel: 0,
            gameScore: 0,
            gameStateTime: 0,
            helpsCount: 3,
        });
    }
}