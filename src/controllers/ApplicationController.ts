import { SOUNDS } from '../Sounds';
import { PrepareIconsCommand } from '../commands/PrepareIconsCommand';
import { Model } from '../core/mvc/model';
import { dataService } from '../core/services/DataService';
import { stageService } from '../core/services/StageService';
import { GameLogic } from '../ecs/game/GameLogic';
import { AppStateEnum, GameModel, GameStateEnum, UserActionAfterTheLastGame } from '../model/GameModel';
import { GameModelHelper } from '../model/GameModelHelper';
import { adsService } from '../services/AdsService';
import { soundService } from '../services/SoundService';
import { vueService } from '../vue/VueService';
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
        vueService.signalPauseButton.on(this.handlePauseButton);
        vueService.signalOptionsButton.on(this.handleOptionsButton);

        new BackgroundController().execute();
        await new PrepareIconsCommand().execute();

        await this.firstCycle();
    }

    private async firstCycle() {
        GameModelHelper.setApplicationState(AppStateEnum.START_SCREEN_FIRST);

        await vueService.signalStartButton.future();

        this.resetGameModelForNext();
        const { level, gridWidth, gridHeight, seed, gameMaxTime } = this.calculateGameModelParams(GameModelHelper.getGameLevel());
        this.setCurrentGameModel(level, gridWidth, gridHeight, seed, gameMaxTime);

        await this.nextCycle();
    }

    private handleWindowFocusBlur = () => {
        if (this.gameModel.raw.appState === AppStateEnum.GAME_SCREEN) {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN_PAUSE);
        }
    }

    private async nextCycle() {
        GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);

        // await new TutorialController().execute();

        // TODO superdraft. rewrite it
        const game = new GameController();
        const race = [game.execute(), vueService.signalOptionsResetLevels.future()];
        await Promise.race(race).then(
            async (value) => {
                game.destroy();
                if (value !== game) {
                    await this.gameResetedToLevelOne();
                    return;
                }
            },
            reason => {
                game.destroy();
                console.log(`race: rejected with ${reason.message}`);
            }
        );

        const gameState = GameModelHelper.getGameState();
        if (gameState === GameStateEnum.GAME_VICTORY) {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_VICTORY);
        } else if (gameState === GameStateEnum.GAME_DEFEATE) {
            GameModelHelper.setApplicationState(GameModelHelper.getGameLevel() < 10 ? AppStateEnum.GAME_DEFEATED : AppStateEnum.GAME_DEFEATED_ADS);
        } else {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_NO_MORE_MOVES);
        }

        await vueService.signalGameEndButton.future();

        GameModelHelper.setApplicationState(AppStateEnum.NONE);

        switch (this.gameModel.raw.userActionAfterTheLastGame) {
            case UserActionAfterTheLastGame.RETRY: {
                const level = this.gameModel.raw.gameLevel;
                const gridWidth = this.gameModel.raw.gridWidth;
                const gridHeight = this.gameModel.raw.gridHeight;
                const seed = this.gameModel.raw.seed;

                const { gameMaxTime } = this.calculateGameModelParams(level);

                this.resetGameModelForNext();
                // this.calculateGameModelParams(GameModelHelper.getGameLevel());
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
                const { level, gridWidth, gridHeight, seed, gameMaxTime } = this.calculateGameModelParams(GameModelHelper.getGameLevel() + 1);
                this.setCurrentGameModel(level, gridWidth, gridHeight, seed, gameMaxTime);
            }
        }

        await this.nextCycle();
    }

    // private cycleInterruptedByOptions = async (signal: Signal) => {
    //     let interrupt = false;
    //     vueService.signalOptionsResetLevels.once(() => {
    //         interrupt = true;
    //         this.gameResetedToLevelOne();
    //     });
    //     // return signal.future();
    //     const race = [signal.future(), vueService.signalOptionsResetLevels.future()];
    //     await Promise.race(race);

    //     return Promise.resolve(interrupt);
    // }

    private gameResetedToLevelOne = async () => {
        this.gameModel.data.gameLevel = 1;
        this.gameModel.data.optionsAreVisible = false;

        this.saveData(true);

        await this.firstCycle();
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
        }

        const keys: string[] = [];
        const icons = this.gameModel.data.icons;
        icons.forEach((icon) => {
            keys.push(icon.key);
        });

        this.gameModel.subscribe(['appState'], this.handleGameModelStateChange);
        this.gameModel.subscribe(['sound'], this.handleSound);

        this.gameModel.subscribe(['appState'], () => { this.saveData() });
    }

    private resetGameModelForNext() {
        const model = dataService.getRootModel<GameModel>();
        model.data.helpsCount = 3;
        model.data.gameStateTime = 0;
        model.data.gameCurrentScore = 0;
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
        model.data.gameMaxTime = t;
    }

    private update = (_time: number) => {

    }

    private handlePauseButton = () => {
        soundService.play(SOUNDS.active_button);

        const currentState = GameModelHelper.getApplicationState();
        if (currentState === AppStateEnum.GAME_SCREEN) {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN_PAUSE);
        } else if (currentState === AppStateEnum.GAME_SCREEN_PAUSE) {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);
        }
    }

    private handleOptionsButton = () => {
        soundService.play(SOUNDS.active_button);

        this.gameModel.data.optionsAreVisible = !this.gameModel.data.optionsAreVisible;

        if (this.gameModel.data.optionsAreVisible && this.gameModel.raw.appState === AppStateEnum.GAME_SCREEN) {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN_PAUSE);
        }

        if (!this.gameModel.data.optionsAreVisible && this.gameModel.raw.appState === AppStateEnum.GAME_SCREEN_PAUSE) {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);
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

    private saveData(remote = false) {
        const model = dataService.getRootModel<GameModel>().raw;
        localStorage.setItem('data', JSON.stringify(model));

        if (remote || model.appState === AppStateEnum.GAME_VICTORY) {
            adsService.saveData({
                gameLevel: model.gameLevel,
                gameTotalScore: model.gameTotalScore + model.gameCurrentScore,
                sound: model.sound,
            });
        }
    }

    private getData() {
        const data = localStorage.getItem('data');
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    }
}
