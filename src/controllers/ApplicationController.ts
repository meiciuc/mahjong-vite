import { PrepareIconsCommand } from '../commands/PrepareIconsController';
import { AppStateEnum, GameStateEnum } from '../model/GameModel';
import { ModelHelper } from '../model/ModelHelper';
import { TimeSkipper } from '../utils/TimeSkipper';
import { vueService } from '../vue/VueService';
import { BackgroundController } from './BackgroundController';
import { BaseController } from './BaseController';
import { GameController } from './GameController';

export class ApplicationController extends BaseController {
    protected async doExecute() {
        // this.setupSdkService();
        
        new BackgroundController().execute();
        await new PrepareIconsCommand().execute();

        ModelHelper.setApplicationState(AppStateEnum.START_SCREEN);
        await vueService.signalStartButton.future();

        await this.nextCicle();
    }

    private async nextCicle() {
        ModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);

        // TODO внесение кастомных данных
        const level = ModelHelper.getGameLevel();
        ModelHelper.resetGameModelForNextLevel();
        ModelHelper.setGameLevel(level + 1);

        const game = await new GameController().execute();
        const gameState = ModelHelper.getGameState();
        if (gameState === GameStateEnum.GAME_VICTORY) {
            ModelHelper.setApplicationState(AppStateEnum.GAME_VICTORY);
        } else if (gameState === GameStateEnum.GAME_DEFEATE) {
            ModelHelper.setApplicationState(AppStateEnum.GAME_DEFEATED);
        } else if (gameState === GameStateEnum.GAME_NO_MORE_MOVES) {
            ModelHelper.setApplicationState(AppStateEnum.GAME_NO_MORE_MOVES);
        }
        await vueService.signalGameEndButton.future();

        game.destroy();

        ModelHelper.setApplicationState(AppStateEnum.NONE);

        this.nextCicle();
    }

    private async setupSdkService() {
        await new TimeSkipper(10000).execute();
        const appState = ModelHelper.getApplicationState();
        ModelHelper.setApplicationState(AppStateEnum.PAUSE_WHILE_ADS);

        await new TimeSkipper(3000).execute();
        ModelHelper.setApplicationState(appState);

        this.setupSdkService();
    }
}
