import { clamp } from "lodash";
import { dataService } from "../core/services/DataService";
import { AppStateEnum, BoosterType, GameModel, GameStateEnum } from "./GameModel";
import { ShopModel, CurrencyType } from "./ShopModel";
import { Config } from "../Config";
import { saveDataService } from "../services/SaveDataService";

export class GameModelHelper {
    static updateGameModel() {
        const model = dataService.getRootModel<GameModel>();
        // TODO внесение кастомных данных
        const data = saveDataService.getData();

        if (data) {
            model.data.level = data.level ? data.level : model.data.level;
            model.data.points = data.points ? data.points : model.data.points;
            model.data.sound = data.sound !== undefined ? data.sound : model.data.sound;

            // TODO для сложных бустеров надо отрефакторить этот кусок
            if (data.boosters) {
                for (const booster in data.boosters) {
                    if (model.data.boosters[booster]) {
                        model.data.boosters[booster].current = data.boosters[booster].current;
                    }
                }
            }
        }
    }

    static resetGameModelForNextGameCycle() {
        const model = dataService.getRootModel<GameModel>();
        model.data.gameAge = 0;
    }

    static setCurrentGameModel(level: number, w: number, h: number, s: string, t: number) {
        const model = dataService.getRootModel<GameModel>();
        model.data.level = clamp(level, 1, Number.MAX_SAFE_INTEGER);
        model.data.gridWidth = w;
        model.data.gridHeight = h;
        model.data.seed = s;
        model.data.gameAge = t;
    }

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

    static getLevel() {
        const gameModel = dataService.getRootModel<GameModel>();
        return gameModel.data.level;
    }

    static setLevel(level: number) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.level = clamp(level, 1, Number.MAX_SAFE_INTEGER);
    }

    static getPoints() {
        const gameModel = dataService.getRootModel<GameModel>();
        return gameModel.data.points;
    }

    static setPoints(value: number) {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.points = value;
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
            level: 1,
            points: 0,
            gameAge: 0,
            boosters: {
                [BoosterType.TIME]: { current: 2 },
                [BoosterType.HELP]: { current: 3 },
            },

            leaderboardIsVisible: false,
            leaderboardSelected: 'today',
            leaderboardItems: [],
            optionsAreVisible: false,
            shopIsVisible: false,
            tutorialOnly: false,
            sound: true,

            icons: [],

            gridWidth: 1,
            gridHeight: 1,
            seed: '',
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

    static setupPreviewModel() {
        Config.setupPreviewModel();
        return dataService.getRootModel<GameModel>();
    }
}