import { dataService } from "../core/services/DataService";
import { AppStateEnum, BoosterType, GameModel, GameStateEnum, UserActionAfterTheLastGame } from "./GameModel";
import { ShopModel, CurrencyType } from "./ShopModel";

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
                gameModel.data.boosters[BoosterType.HELP] ? gameModel.data.boosters[BoosterType.HELP].current++ : gameModel.data.boosters[BoosterType.HELP] = { current: 1 };
                break;
        }

    }

    static getBooster(type: BoosterType) {
        const gameModel = dataService.getRootModel<GameModel>();
        return gameModel.data.boosters[type];
    }

    static setBooster(type: BoosterType, value: number) {
        const booster = GameModelHelper.getBooster(type);
        if (booster) {
            console.log('setBooster', type, value)
            // const analytics = GameModelHelper.getModel().data.analytics;
            booster.current = value;
        }
    }

    static getModel() {
        return dataService.getRootModel<GameModel>();
    }

    static createModel() {
        dataService.config<GameModel>({
            appState: AppStateEnum.NONE,
            analytics: {},
            shop: GameModelHelper.createShop(),
            gameState: GameStateEnum.NONE,
            gameLevel: 1,
            gameTotalScore: 0,
            gameAge: 0,
            boosters: {
                [BoosterType.TIME]: { current: 2 },
                [BoosterType.HELP]: { current: 3 },
            },

            optionsAreVisible: false,
            shopIsVisible: false,
            sound: true,

            icons: [],

            gridWidth: 1,
            gridHeight: 1,
            seed: '',

            userActionAfterTheLastGame: UserActionAfterTheLastGame.DEFAULT,
        });
    }

    static createShop() {
        return <ShopModel>{
            proposales: [
                {
                    id: '0',
                    items: [{
                        product: BoosterType.TIME,
                        count: 1
                    }],
                    price: {
                        valute: CurrencyType.POINTS,
                        price: 100
                    }

                },
                {
                    id: '1',
                    items: [{
                        product: BoosterType.TIME,
                        count: 4,
                    }],
                    price: {
                        valute: CurrencyType.VIDEO,
                        price: 1
                    }
                },
                {
                    id: '2',
                    items: [{
                        product: BoosterType.HELP,
                        count: 2,
                    }],
                    price: {
                        valute: CurrencyType.POINTS,
                        price: 100
                    }
                },
                {
                    id: '3',
                    items: [{
                        product: BoosterType.HELP,
                        count: 7,
                    }],
                    price: {
                        valute: CurrencyType.VIDEO,
                        price: 1
                    }
                }
            ],
        };
    }
}