import { dataService } from "../core/services/DataService";
import { Languages } from "../utils/Localization";
import { AppStateEnum, BoosterType, GameModel, GameStateEnum, UserActionAfterTheLastGame } from "./GameModel";

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

    static setUserActionAfterTheLastGame(value: UserActionAfterTheLastGame) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.userActionAfterTheLastGame = value;
    }

    static addBooster(type: BoosterType) {
        const gameModel = dataService.getRootModel<GameModel>();
        switch (type) {
            case BoosterType.TIME:
                gameModel.data.boosters[BoosterType.TIME] ? gameModel.data.boosters[BoosterType.TIME].current++ : gameModel.data.boosters[BoosterType.TIME] = { current: 1 };
                break;
            case BoosterType.HELP:
                gameModel.data.boosters[BoosterType.HELP] ? gameModel.data.boosters[BoosterType.HELP].current++ : gameModel.data.boosters[BoosterType.TIME] = { current: 1 };
                break;
        }

    }

    static createModel() {
        dataService.config<GameModel>({
            appState: AppStateEnum.NONE,
            gameState: GameStateEnum.NONE,
            gameLevel: 1,
            gameTotalScore: 0,
            gameAge: 0,
            helpsCount: 3,
            boosters: {
                [BoosterType.TIME]: { current: 2 },
                [BoosterType.HELP]: { current: 3 },
            },

            optionsAreVisible: false,
            sound: true,

            icons: [],

            gridWidth: 1,
            gridHeight: 1,
            seed: '',

            userActionAfterTheLastGame: UserActionAfterTheLastGame.DEFAULT,

            language: Languages.en,
        });
    }
}