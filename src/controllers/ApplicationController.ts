import { Config } from '../Config';
import { SOUNDS } from '../Sounds';
import { PrepareIconsCommand } from '../commands/PrepareIconsCommand';
import { Model } from '../core/mvc/model';
import { dataService } from '../core/services/DataService';
import { stageService } from '../core/services/StageService';
import { GameLogic } from '../ecs/game/GameLogic';
import { AppStateEnum, BoosterType, GameModel, GameStateEnum, UserActionAfterTheLastGame } from '../model/GameModel';
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
    private applicationStateHystory: AppStateEnum[] = [];

    protected async doExecute() {
        adsService.gameStart();

        stageService.updateSignal.add(this.update);
        window.addEventListener('blur', this.handleWindowFocusBlur);

        new BackgroundController().execute();
        await new PrepareIconsCommand().execute();

        if (Config.DEV_PREVIEW_GAMEPLAY_MODE) {
            this.gameModel = GameModelHelper.setupPreviewModel();
        } else {
            this.setupGameModel();
            GameModelHelper.updateGameModel();
        }

        if (GameModelHelper.getGameLevel() < 2 && !localStorage.getItem('firstTime')) {
            localStorage.setItem('firstTime', `${Date.now()}`);
            await this.tutorialCycle();
        }

        await this.startCycle();
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

    private async startCycle() {
        if (!Config.DEV_PREVIEW_GAMEPLAY_MODE) {
            GameModelHelper.updateGameModel();
        }

        try {
            vueService.signalDataBus.off(this.handleDataBus);
        } catch (error) { }
        vueService.signalDataBus.on(this.handleDataBus);

        GameModelHelper.setApplicationState(GameModelHelper.getGameLevel() < 2 ? AppStateEnum.START_SCREEN_FIRST : AppStateEnum.START_SCREEN);

        const res1 = await this.waitApplicationCycleContinue(this.waitVueServiceSignal(VueServiceSignals.StartButton));

        if (res1 === VueServiceSignals.TutorialButton) {
            await this.tutorialCycle();
            this.startCycle();
        } else if (res1 === VueServiceSignals.StartButton) {
            this.gameCycleWasInterrupted(res1);
            GameModelHelper.resetGameModelForNextGameCycle();
            const { gameLevel, gridWidth, gridHeight, seed, gameMaxTime } = GameLogic.calculateGameModelParams(GameModelHelper.getGameLevel());
            GameModelHelper.setCurrentGameModel(gameLevel, gridWidth, gridHeight, seed, gameMaxTime);

            this.nextCycle();
        }
    }

    // TODO FSM
    private async nextCycle() {
        GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);

        const game = new GameController();
        adsService.gameplayStart();
        const res1 = await this.waitApplicationCycleContinue(game.execute());
        game.destroy();
        adsService.gameplayStop();

        if (res1 !== game) {
            this.gameCycleWasInterrupted(res1);
            return;
        }

        const gameState = GameModelHelper.getGameState();
        if (gameState === GameStateEnum.GAME_VICTORY) {
            GameModelHelper.setGameLevel(GameModelHelper.getGameLevel() + 1);
            GameModelHelper.setApplicationState(AppStateEnum.GAME_VICTORY);
        } else if (gameState === GameStateEnum.GAME_DEFEATE) {
            GameModelHelper.setApplicationState(GameModelHelper.getGameLevel() < 10 ? AppStateEnum.GAME_DEFEAT : AppStateEnum.GAME_DEFEAT_ADS);
        } else {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_NO_MORE_MOVES);
        }

        saveDataService.saveData();

        const res2 = await this.waitApplicationCycleContinue(this.waitVueServiceSignal(VueServiceSignals.GameEndButton));
        if (res2 !== VueServiceSignals.GameEndButton) {
            this.gameCycleWasInterrupted(res2);
            return;
        }

        GameModelHelper.setApplicationState(AppStateEnum.NONE);

        switch (this.gameModel.data.userActionAfterTheLastGame) {
            case UserActionAfterTheLastGame.RETRY: {
                const { gridWidth, gridHeight, seed, gameLevel } = this.gameModel.data;
                const { gameMaxTime } = GameLogic.calculateGameModelParams(gameLevel);

                GameModelHelper.resetGameModelForNextGameCycle();
                GameModelHelper.setCurrentGameModel(gameLevel, gridWidth, gridHeight, seed, gameMaxTime);
                break;
            }
            case UserActionAfterTheLastGame.RESET: {
                GameModelHelper.resetGameModelForNextGameCycle();
                const { gameLevel, gridWidth, gridHeight, seed, gameMaxTime } = GameLogic.calculateGameModelParams(GameModelHelper.getGameLevel());
                GameModelHelper.setCurrentGameModel(gameLevel, gridWidth, gridHeight, seed, gameMaxTime);
                break;
            }
            case UserActionAfterTheLastGame.PREVIOUS: {
                GameModelHelper.resetGameModelForNextGameCycle();
                const { gameLevel, gridWidth, gridHeight, seed, gameMaxTime } = GameLogic.calculateGameModelParams(GameModelHelper.getGameLevel() - 1);
                GameModelHelper.setCurrentGameModel(gameLevel, gridWidth, gridHeight, seed, gameMaxTime);
                break;
            }
            default: {
                GameModelHelper.resetGameModelForNextGameCycle();
                const { gameLevel, gridWidth, gridHeight, seed, gameMaxTime } = GameLogic.calculateGameModelParams(GameModelHelper.getGameLevel());
                GameModelHelper.setCurrentGameModel(gameLevel, gridWidth, gridHeight, seed, gameMaxTime);
            }
        }

        this.nextCycle();
    }

    private setupGameModel() {
        this.gameModel = dataService.getRootModel<GameModel>();

        this.gameModel.subscribe(['appState'], this.handleGameModelStateChange);
        this.gameModel.subscribe(['sound'], this.handleSound);
        this.gameModel.subscribe(['boosters'], this.handleBoosters);
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
                    } else if (prop.price.valute === CurrencyType.POINTS && this.gameModel.data.gameScore >= prop.price.price) {
                        this.gameModel.data.gameScore -= prop.price.price;
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
        this.applicationStateHystory.push(currenState);
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

    private handleBoosters = (...args) => {
        console.log('handleBoosters', args)
    }

    private async waitVueServiceSignal(value: VueServiceSignals) {
        const data = await vueService.signalDataBus.future();
        if (data[0] === value) {
            return Promise.resolve(value);
        } else {
            return this.waitVueServiceSignal(value);
        }
    }

    private async waitApplicationCycleContinue(promise: Promise<unknown>) {
        return Promise.race([
            promise,
            this.waitVueServiceSignal(VueServiceSignals.OptionsResetLevels),
            this.waitVueServiceSignal(VueServiceSignals.TutorialButton)
        ]);
    }

    private gameCycleWasInterrupted(value: VueServiceSignals) {
        switch (value) {
            case VueServiceSignals.OptionsResetLevels:
                this.gameModel.data.gameLevel = 1;
                this.gameModel.data.optionsAreVisible = false;
                saveDataService.saveData();
                this.startCycle();
                break;
            default:
                this.startCycle();
        }
    }
}
