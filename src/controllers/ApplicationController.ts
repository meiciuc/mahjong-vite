import { Config } from '../Config';
import { SOUNDS } from '../Sounds';
import { PrepareIconsCommand } from '../commands/PrepareIconsCommand';
import { Model } from '../core/mvc/model';
import { dataService } from '../core/services/DataService';
import { stageService } from '../core/services/StageService';
import easingsFunctions from '../core/utils/easingsFunctions';
import { AppStateEnum, GameModel, GameStateEnum, UserActionAfterTheLastGame } from '../model/GameModel';
import { GameModelHelper } from '../model/GameModelHelper';
import { adsService } from '../services/AdsService';
import { soundService } from '../services/SoundService';
import { vueService } from '../vue/VueService';
import { BackgroundController } from './BackgroundController';
import { BaseController } from './BaseController';
import { GameController } from './GameController';
import { TutorialController } from './TutorialController';

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

        GameModelHelper.setApplicationState(AppStateEnum.START_SCREEN_FIRST);

        await vueService.signalStartButton.future();

        this.resetGameModelForNext();
        const { level, gridWidth, gridHeight, seed } = this.calculateGameModelParams(1);
        this.setCurrentGameModel(level, gridWidth, gridHeight, seed);

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

        const game = await new GameController().execute();
        game.destroy();

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

                this.resetGameModelForNext();
                this.calculateGameModelParams(GameModelHelper.getGameLevel());
                this.setCurrentGameModel(level, gridWidth, gridHeight, seed);
                break;
            }
            case UserActionAfterTheLastGame.RESET: {
                this.resetGameModelForNext();
                const { level, gridWidth, gridHeight, seed } = this.calculateGameModelParams(GameModelHelper.getGameLevel());
                this.setCurrentGameModel(level, gridWidth, gridHeight, seed);
                break;
            }
            case UserActionAfterTheLastGame.PREVIOUS: {
                this.resetGameModelForNext();
                const { level, gridWidth, gridHeight, seed } = this.calculateGameModelParams(GameModelHelper.getGameLevel() - 1);
                this.setCurrentGameModel(level, gridWidth, gridHeight, seed);
                break;
            }
            default: {
                this.resetGameModelForNext();
                const { level, gridWidth, gridHeight, seed } = this.calculateGameModelParams(GameModelHelper.getGameLevel() + 1);
                this.setCurrentGameModel(level, gridWidth, gridHeight, seed);
            }
        }



        await this.nextCycle();
    }

    private setupGameModel() {
        // TODO внесение кастомных данных
        this.gameModel = dataService.getRootModel<GameModel>();
        const keys: string[] = [];
        const icons = this.gameModel.data.icons;
        icons.forEach((icon) => {
            keys.push(icon.key);
        });

        this.gameModel.subscribe(['appState'], this.handleGameModelStateChange);
        this.gameModel.subscribe(['sound'], this.handleSound);
    }

    private resetGameModelForNext() {
        const model = dataService.getRootModel<GameModel>();
        model.data.helpsCount = 3;
        model.data.gameStateTime = 0;
        model.data.gameCurrentScore = 0;
        model.data.userActionAfterTheLastGame = UserActionAfterTheLastGame.DEFAULT;
    }

    private calculateGameModelParams(level: number) {
        const easing = easingsFunctions.easeOutQuad;

        const start = 9;
        const end = 23;

        const currentLevel = level;
        const scaleLevel = currentLevel / Config.MAX_GAME_LEVEL;

        const size = Math.floor(easing(scaleLevel) * (end - start) + start);
        const commonCount = size + size;
        const scale = stageService.height / (stageService.width + stageService.height);

        let gridHeight = Math.floor(commonCount * scale);
        const gridWidth = Math.round(commonCount - gridHeight);

        if (gridHeight % 2 !== 0 && gridWidth % 2 !== 0) {
            gridHeight++;
        }

        const seed = `${Math.random()}`;

        return { level, gridWidth, gridHeight, seed };
    }

    private setCurrentGameModel(l: number, w: number, h: number, s: string) {
        const model = dataService.getRootModel<GameModel>();
        model.data.gameLevel = l;
        model.data.gridWidth = w;
        model.data.gridHeight = h;
        model.data.seed = s;
        model.data.gameMaxTime = w * h * 2;
    }

    private update = (time: number) => {

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

    private handleGameModelStateChange = (currenState: AppStateEnum, oldState: AppStateEnum) => {
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
    }
}
