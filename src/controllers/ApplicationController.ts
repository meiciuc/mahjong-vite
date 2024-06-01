import { Config } from '../Config';
import { SOUNDS } from '../Sounds';
import { PrepareIconsCommand } from '../commands/PrepareIconsCommand';
import { Model } from '../core/mvc/model';
import { dataService } from '../core/services/DataService';
import { stageService } from '../core/services/StageService';
import { GameLogic } from '../ecs/game/GameLogic';
import { AppStateEnum, BoosterType, GameModel, GameStateEnum } from '../model/GameModel';
import { GameModelHelper } from '../model/GameModelHelper';
import { CurrencyType } from '../model/ShopModel';
import { adsService } from '../services/AdsService';
import { saveDataService } from '../services/SaveDataService';
import { soundService } from '../services/SoundService';
import { TimeSkipper } from '../utils/TimeSkipper';
import { AnyBusData, ShopData, VueServiceSignals, vueService } from '../vue/VueService';
import { BackgroundController } from './BackgroundController';
import { BaseController } from './BaseController';
import { GameController } from './GameController';
import { TutorialController } from './TutorialController';

export class ApplicationController extends BaseController {

    private gameModel?: Model<GameModel>;

    protected async doExecute() {
        adsService.gameStart();

        stageService.updateSignal.add(this.update);
        window.addEventListener('blur', this.handleWindowFocusBlur);

        new BackgroundController().execute();
        await new PrepareIconsCommand().execute();

        this.setupGameModel();
        GameModelHelper.updateGameModel();

        this.mainCycle();
    }

    private async mainCycle() {
        GameModelHelper.updateGameModel();

        try {
            vueService.signalDataBus.off(this.handleDataBus);
        } catch (error) { }
        vueService.signalDataBus.on(this.handleDataBus);

        GameModelHelper.setApplicationState(GameModelHelper.getLevel() < 2 ? AppStateEnum.START_SCREEN_FIRST : AppStateEnum.START_SCREEN);

        const startScreen = await Promise.race([
            this.waitVueServiceSignal(VueServiceSignals.StartButton),
            this.waitVueServiceSignal(VueServiceSignals.TutorialButton)
        ]);

        switch (startScreen) {
            case VueServiceSignals.StartButton:
                if (Config.DEV_PREVIEW_GAMEPLAY_MODE) {
                    this.gameModel = GameModelHelper.setupPreviewModel();
                }
                GameModelHelper.resetGameModelForNextGameCycle();
                const { level, gridWidth, gridHeight, seed, gameMaxTime } = GameLogic.calculateGameModelParams(GameModelHelper.getLevel());
                GameModelHelper.setCurrentGameModel(level, gridWidth, gridHeight, seed, gameMaxTime);
                await this.gameCycle();
                break;
            case VueServiceSignals.TutorialButton:
                await this.tutorialCycle();
                this.mainCycle();
                break;
            default:
                this.mainCycle();
        }
    }

    private async tutorialCycle() {
        adsService.gameplayStart();

        GameModelHelper.resetGameModelForNextGameCycle();
        GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);

        const game = new TutorialController();
        const result = await Promise.race([game.execute(), this.waitVueServiceSignal(VueServiceSignals.LeaveTutorial)]);
        game.destroy();

        adsService.gameplayStop();

        if (result !== game) {
            return Promise.resolve();
        }

        GameModelHelper.setApplicationState(AppStateEnum.TUTORIAL_VICTORY_SCREEN);
        await new TimeSkipper(2000).execute();
    }

    private async gameCycle() {
        GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);

        adsService.gameplayStart();
        const game = new GameController()
        await game.execute();
        game.destroy();
        adsService.gameplayStop();

        const gameState = GameModelHelper.getGameState();
        if (gameState === GameStateEnum.GAME_VICTORY) {
            GameModelHelper.setLevel(GameModelHelper.getLevel() + 1);
            GameModelHelper.setApplicationState(AppStateEnum.GAME_VICTORY);
        } else if (gameState === GameStateEnum.GAME_DEFEATE) {
            GameModelHelper.setApplicationState(GameModelHelper.getLevel() < 10 ? AppStateEnum.GAME_DEFEAT : AppStateEnum.GAME_DEFEAT_ADS);
        } else {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_NO_MORE_MOVES);
        }

        saveDataService.saveLeaderboard();
        saveDataService.saveData();

        const endGameScreen = await Promise.race([
            this.waitVueServiceSignal(VueServiceSignals.GameEndButton),
            this.waitVueServiceSignal(VueServiceSignals.TutorialButton),
            this.waitVueServiceSignal(VueServiceSignals.RetryButton),
        ]);

        switch (endGameScreen) {
            case VueServiceSignals.GameEndButton: {
                GameModelHelper.resetGameModelForNextGameCycle();
                const { level, gridWidth, gridHeight, seed, gameMaxTime } = GameLogic.calculateGameModelParams(GameModelHelper.getLevel());
                GameModelHelper.setCurrentGameModel(level, gridWidth, gridHeight, seed, gameMaxTime);
                this.gameCycle();
                return;
            }
            case VueServiceSignals.TutorialButton: {
                await this.tutorialCycle();
                this.mainCycle();
                return;
            }
            case VueServiceSignals.RetryButton: {
                const { gridWidth, gridHeight, seed, level } = this.gameModel.data;
                const { gameMaxTime } = GameLogic.calculateGameModelParams(level);

                GameModelHelper.resetGameModelForNextGameCycle();
                GameModelHelper.setCurrentGameModel(level, gridWidth, gridHeight, seed, gameMaxTime);
                this.gameCycle();
                return;
            }
            default:
                this.mainCycle();
        }
    }

    private setupGameModel() {
        this.gameModel = dataService.getRootModel<GameModel>();

        this.gameModel.subscribe(['appState'], this.handleGameModelStateChange);
        this.gameModel.subscribe(['sound'], this.handleSound);
    }

    private update = (_time: number) => {

    }

    private handleWindowFocusBlur = () => {
        if (GameModelHelper.getApplicationState() === AppStateEnum.GAME_SCREEN) {
            vueService.signalDataBus.dispatch(VueServiceSignals.OptionsButton, {});
        }
    }

    // TODO use FSM
    private handleDataBus = async (type: VueServiceSignals, data: AnyBusData) => {
        switch (type) {
            case VueServiceSignals.ProposalPurchased: {
                const id = (data as ShopData).id;
                for (const prop of this.gameModel.data.shop.proposales) {
                    const boosterType = prop.items[0].product;
                    const boosterCound = prop.items[0].count;
                    if (prop.id !== id) {
                        continue;
                    }

                    let result = false;
                    if (prop.price.valute === CurrencyType.VIDEO) {
                        try {
                            await adsService.showRewarded();
                            result = true;
                        } catch (error: unknown) {
                            result = false;
                        }
                    } else if (prop.price.valute === CurrencyType.POINTS && this.gameModel.data.points >= prop.price.price) {
                        this.gameModel.data.points -= prop.price.price;
                        result = true;
                    }

                    if (!result) {
                        continue;
                    }

                    for (let i = 0; i < boosterCound; i++) {
                        GameModelHelper.addBooster(boosterType);
                    }
                    saveDataService.saveData();
                }
                break;
            }
            case VueServiceSignals.LeaderBoardButton:
                adsService.showLeaderboard();
                soundService.play(SOUNDS.active_button);

                this.gameModel.data.leaderboardIsVisible = !this.gameModel.data.leaderboardIsVisible;

                if (this.gameModel.data.leaderboardIsVisible && this.gameModel.data.appState === AppStateEnum.GAME_SCREEN) {
                    GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN_PAUSE);
                }

                if (!this.gameModel.data.leaderboardIsVisible && this.gameModel.data.appState === AppStateEnum.GAME_SCREEN_PAUSE) {
                    GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);
                }

                if (this.gameModel.data.leaderboardIsVisible) {
                    this.gameModel.data.optionsAreVisible = false;
                    this.gameModel.data.shopIsVisible = false;
                }
                break;
            case VueServiceSignals.LeaderBoardYesterdayButton:
                adsService.showLeaderboard('yesterday');
                soundService.play(SOUNDS.active_button);
                break;
            case VueServiceSignals.LeaderBoardTodayButton:
                adsService.showLeaderboard('today');
                soundService.play(SOUNDS.active_button);
                break;
            case VueServiceSignals.LeaderBoardAlwaysButton:
                adsService.showLeaderboard('always');
                soundService.play(SOUNDS.active_button);
                break;
            case VueServiceSignals.OpenShop:
            case VueServiceSignals.OptionsButton:
                soundService.play(SOUNDS.active_button);

                this.gameModel.data.optionsAreVisible = !this.gameModel.data.optionsAreVisible;
                this.gameModel.data.shopIsVisible = type === VueServiceSignals.OpenShop;

                if (this.gameModel.data.optionsAreVisible && this.gameModel.data.appState === AppStateEnum.GAME_SCREEN) {
                    GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN_PAUSE);
                }

                if (!this.gameModel.data.optionsAreVisible && this.gameModel.data.appState === AppStateEnum.GAME_SCREEN_PAUSE) {
                    GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);
                }

                if (this.gameModel.data.optionsAreVisible) {
                    this.gameModel.data.leaderboardIsVisible = false;
                }
                break;
            case VueServiceSignals.BoosterHelpClick: {
                const boosters = this.gameModel.data.boosters[BoosterType.HELP];
                if (boosters) {
                    if (GameModelHelper.getApplicationState() === AppStateEnum.GAME_SCREEN) {
                        if (!boosters.current) {
                            vueService.signalDataBus.dispatch(VueServiceSignals.OpenShop, {});
                        }
                    } else {
                        vueService.signalDataBus.dispatch(VueServiceSignals.OpenShop, {});
                    }
                }
                break;
            }
            case VueServiceSignals.BoosterTimeClick: {
                const boosters = this.gameModel.data.boosters[BoosterType.TIME];
                if (boosters) {
                    if (GameModelHelper.getApplicationState() === AppStateEnum.GAME_SCREEN) {
                        if (!boosters.current) {
                            vueService.signalDataBus.dispatch(VueServiceSignals.OpenShop, {});
                        }
                    } else {
                        vueService.signalDataBus.dispatch(VueServiceSignals.OpenShop, {});
                    }
                }
                break;
            }
            case VueServiceSignals.ShareShow:
                adsService.showShare();
                break;
            case VueServiceSignals.InviteShow:
                adsService.showInvite();
                break;
        }
    }

    private handleGameModelStateChange = (currenState: AppStateEnum, _oldState: AppStateEnum) => {
        switch (currenState) {
            case AppStateEnum.START_SCREEN:
            case AppStateEnum.GAME_SCREEN_PAUSE:
                adsService.showSticky(true);
                break;
            case AppStateEnum.GAME_SCREEN:
                adsService.showSticky(false);
                soundService.play(SOUNDS.active_button);
                break;
            case AppStateEnum.GAME_VICTORY:
                soundService.play(SOUNDS.win_screen);
                break;
        }
    }

    private handleSound = (current: boolean) => {
        soundService.mute(!current);
        soundService.play(SOUNDS.active_button);
        localStorage.setItem('data', JSON.stringify(dataService.getRootModel<GameModel>().raw));
    }

    private async waitVueServiceSignal(value: VueServiceSignals): Promise<VueServiceSignals> {
        const data = await vueService.signalDataBus.future();
        if (data[0] === value) {
            return Promise.resolve(value);
        } else {
            return this.waitVueServiceSignal(value);
        }
    }
}
