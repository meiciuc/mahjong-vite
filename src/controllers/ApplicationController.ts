import { Config } from '../Config';
import { SOUNDS } from '../Sounds';
import { PrepareIconsCommand } from '../commands/PrepareIconsCommand';
import { Model } from '../core/mvc/model';
import { dataService } from '../core/services/DataService';
import { stageService } from '../core/services/StageService';
import { GameLogic } from '../ecs/game/GameLogic';
import { AppStateEnum, BoosterType, GameModel, GameStateEnum, UserActionAfterTheLastGame } from '../model/GameModel';
import { GameModelHelper } from '../model/GameModelHelper';
import { adsService } from '../services/AdsService';
import { soundService } from '../services/SoundService';
import { VueServiceSignals, vueService } from '../vue/VueService';
import { BackgroundController } from './BackgroundController';
import { BaseController } from './BaseController';
import { GameController } from './GameController';
// import { TutorialController } from './TutorialController';

export class ApplicationController extends BaseController {

    private gameModel?: Model<GameModel>;
    private applicationStateHystory: AppStateEnum[] = [];

    protected async doExecute() {
        this.setupGameModel();

        stageService.updateSignal.add(this.update);
        window.addEventListener('blur', this.handleWindowFocusBlur);
        vueService.signalDataBus.on(this.handleDataBus);

        new BackgroundController().execute();
        await new PrepareIconsCommand().execute();

        await this.firstCycle();
    }

    private async firstCycle() {
        GameModelHelper.setApplicationState(GameModelHelper.getGameLevel() < 3 ? AppStateEnum.START_SCREEN_FIRST : AppStateEnum.START_SCREEN);

        const res1 = await this.waitGameCycleContinue(this.waitVueServiceSignal(VueServiceSignals.StartButton));
        if (res1 !== VueServiceSignals.StartButton) {
            this.gameCycleWasInterrupted(res1);
            return;
        }

        this.resetGameModelForNext();
        const { level, gridWidth, gridHeight, seed, gameMaxTime } = this.calculateGameModelParams(GameModelHelper.getGameLevel());
        this.setCurrentGameModel(level, gridWidth, gridHeight, seed, gameMaxTime);

        this.nextCycle();
    }

    private handleWindowFocusBlur = () => {
        if (GameModelHelper.getApplicationState() === AppStateEnum.GAME_SCREEN) {
            vueService.signalDataBus.dispatch(VueServiceSignals.OptionsButton);
        }
    }

    private async nextCycle() {
        GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);

        // await new TutorialController().execute();

        const game = new GameController();
        const res1 = await this.waitGameCycleContinue(game.execute());
        game.destroy();

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

        this.saveData();

        const res2 = await this.waitGameCycleContinue(this.waitVueServiceSignal(VueServiceSignals.GameEndButton));
        if (res2 !== VueServiceSignals.GameEndButton) {
            this.gameCycleWasInterrupted(res2);
            return;
        }

        GameModelHelper.setApplicationState(AppStateEnum.NONE);

        switch (this.gameModel.raw.userActionAfterTheLastGame) {
            case UserActionAfterTheLastGame.RETRY: {
                const level = this.gameModel.raw.gameLevel;
                const gridWidth = this.gameModel.raw.gridWidth;
                const gridHeight = this.gameModel.raw.gridHeight;
                const seed = this.gameModel.raw.seed;

                const { gameMaxTime } = this.calculateGameModelParams(level);

                this.resetGameModelForNext();
                this.setCurrentGameModel(level, gridWidth, gridHeight, seed, gameMaxTime);
                break;
            }
            case UserActionAfterTheLastGame.RESET: {
                this.resetGameModelForNext();
                const { level, gridWidth, gridHeight, seed, gameMaxTime } = this.calculateGameModelParams(GameModelHelper.getGameLevel());
                this.setCurrentGameModel(level, gridWidth, gridHeight, seed, gameMaxTime);
                break;
            }
            case UserActionAfterTheLastGame.PREVIOUS: {
                this.resetGameModelForNext();
                const { level, gridWidth, gridHeight, seed, gameMaxTime } = this.calculateGameModelParams(GameModelHelper.getGameLevel() - 1);
                this.setCurrentGameModel(level, gridWidth, gridHeight, seed, gameMaxTime);
                break;
            }
            default: {
                this.resetGameModelForNext();
                const { level, gridWidth, gridHeight, seed, gameMaxTime } = this.calculateGameModelParams(GameModelHelper.getGameLevel());
                this.setCurrentGameModel(level, gridWidth, gridHeight, seed, gameMaxTime);
            }
        }

        this.nextCycle();
    }

    private setupGameModel() {
        // TODO внесение кастомных данных
        this.gameModel = dataService.getRootModel<GameModel>();

        let data = adsService.getData();
        if (!data) {
            data = this.getData();
        }
        if (data) {
            this.gameModel.data.gameLevel = data.gameLevel ? data.gameLevel : this.gameModel.data.gameLevel;
            this.gameModel.data.gameTotalScore = data.gameTotalScore ? data.gameTotalScore : this.gameModel.data.gameTotalScore;
            this.gameModel.data.sound = data.sound !== undefined ? data.sound : this.gameModel.data.sound;

            // TODO для сложных бустеров надо отрефакторить этот кусок
            if (data.boosters) {
                for (const booster in data.boosters) {
                    if (this.gameModel.data.boosters[booster]) {
                        this.gameModel.data.boosters[booster].current = data.boosters[booster].current;
                    }
                }
            }
        }

        const keys: string[] = [];
        const icons = this.gameModel.data.icons;
        icons.forEach((icon) => {
            keys.push(icon.key);
        });

        this.gameModel.subscribe(['appState'], this.handleGameModelStateChange);
        this.gameModel.subscribe(['sound'], this.handleSound);
        this.gameModel.subscribe(['boosters'], this.handleBoosters);
    }

    private resetGameModelForNext() {
        const model = dataService.getRootModel<GameModel>();
        model.data.helpsCount = 3;
        model.data.gameAge = 0;
        model.data.userActionAfterTheLastGame = UserActionAfterTheLastGame.DEFAULT;
    }

    private calculateGameModelParams(level: number) {
        return GameLogic.calculateGameModelParams(level);
    }

    private setCurrentGameModel(l: number, w: number, h: number, s: string, t: number) {
        const model = dataService.getRootModel<GameModel>();
        model.data.gameLevel = l;
        model.data.gridWidth = w;
        model.data.gridHeight = h;
        model.data.seed = s;
        model.data.gameAge = t;
    }

    private update = (_time: number) => {

    }

    private handleDataBus = (data: VueServiceSignals) => {
        switch (data) {
            case VueServiceSignals.PauseButton:
            case VueServiceSignals.OptionsButton:
                soundService.play(SOUNDS.active_button);

                this.gameModel.data.optionsAreVisible = !this.gameModel.data.optionsAreVisible;

                if (this.gameModel.data.optionsAreVisible && this.gameModel.raw.appState === AppStateEnum.GAME_SCREEN) {
                    GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN_PAUSE);
                }

                if (!this.gameModel.data.optionsAreVisible && this.gameModel.raw.appState === AppStateEnum.GAME_SCREEN_PAUSE) {
                    GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);
                }
                break;
            case VueServiceSignals.BoosterHelpUseBooster: {
                if (GameModelHelper.getApplicationState() === AppStateEnum.GAME_SCREEN) {
                    let helpsCount = this.gameModel.raw.helpsCount;

                    if (helpsCount > 0) {
                        vueService.signalDataBus.dispatch(VueServiceSignals.HelpButton);
                    } else {
                        const helpBoosters = this.gameModel.data.boosters[BoosterType.HELP];
                        if (helpBoosters && helpBoosters.current > 0) {
                            helpBoosters.current--;
                            vueService.signalDataBus.dispatch(VueServiceSignals.HelpButton);
                            this.saveData();
                        }
                    }
                }
                break;
            }
            case VueServiceSignals.BoosterTimeUseBooster: {
                if (GameModelHelper.getApplicationState() === AppStateEnum.GAME_SCREEN) {
                    const timeBoosters = this.gameModel.data.boosters[BoosterType.TIME];
                    if (timeBoosters && timeBoosters.current > 0) {
                        timeBoosters.current--
                        this.gameModel.data.gameAge += 60;
                        this.saveData();
                    }
                }
                break;
            }
            case VueServiceSignals.BoosterHelpSpendScore:
            case VueServiceSignals.BoosterHelpWatchReward:
            case VueServiceSignals.BoosterTimeSpendScore:
            case VueServiceSignals.BoosterTimeWatchReward:
                this.shop(data);
                break;
        }
    }

    private async shop(data: VueServiceSignals) {
        switch (data) {
            case VueServiceSignals.BoosterHelpSpendScore: {
                this.gameModel.data.gameTotalScore = Math.max(0, this.gameModel.data.gameTotalScore - Config.MIN_BOOSTER_PRICE);
                GameModelHelper.addBooster(BoosterType.HELP);
                this.saveData();
                break;
            }
            case VueServiceSignals.BoosterHelpWatchReward: {
                adsService.showRewarded()
                    .then(() => {
                        GameModelHelper.addBooster(BoosterType.HELP);
                        this.saveData();
                    })
                    .catch((error: unknown) => {
                        console.log(error);
                    });
                break;
            }
            case VueServiceSignals.BoosterTimeSpendScore: {
                this.gameModel.data.gameTotalScore = Math.max(0, this.gameModel.data.gameTotalScore - Config.MIN_BOOSTER_PRICE);
                GameModelHelper.addBooster(BoosterType.TIME);
                this.saveData();
                break;
            }
            case VueServiceSignals.BoosterTimeWatchReward: {
                adsService.showRewarded()
                    .then(() => {
                        GameModelHelper.addBooster(BoosterType.TIME);
                        this.saveData();
                    })
                    .catch((error: unknown) => {
                        console.log(error);
                    });
                break;
            }
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

    private saveData() {
        const model = dataService.getRootModel<GameModel>().raw;
        localStorage.setItem('data', JSON.stringify(model));

        adsService.saveData({
            gameLevel: model.gameLevel,
            gameTotalScore: model.gameTotalScore,
            sound: model.sound,
            boosters: model.boosters,
        });
    }

    private getData() {
        const data = localStorage.getItem('data');
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    }

    private async waitVueServiceSignal(value: VueServiceSignals) {
        const data = await vueService.signalDataBus.future();
        if (data[0] === value) {
            return Promise.resolve(value);
        } else {
            return this.waitVueServiceSignal(value);
        }
    }

    private async waitGameCycleContinue(promise: Promise<unknown>) {
        return Promise.race([promise, this.waitVueServiceSignal(VueServiceSignals.OptionsResetLevels)]);
    }

    private gameCycleWasInterrupted(value: VueServiceSignals) {
        switch (value) {
            case VueServiceSignals.OptionsResetLevels:
                this.gameModel.data.gameLevel = 1;
                this.gameModel.data.optionsAreVisible = false;
                this.saveData();
                this.firstCycle();
                break;
            default:
                this.firstCycle();
        }
    }
}
