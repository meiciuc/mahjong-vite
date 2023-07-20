import { dataService } from "../core/services/DataService";
import { GameLevelHelper } from "./GameLevelHelper";
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

    static resetGameModelForNextLevel() {
        new GameLevelHelper().nextLevel();
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
        new GameLevelHelper().createModel();
    }
}