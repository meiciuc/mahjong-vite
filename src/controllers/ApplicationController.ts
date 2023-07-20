import { PrepareIconsCommand } from '../commands/PrepareIconsCommand';
import { dataService } from '../core/services/DataService';
import { stageService } from '../core/services/StageService';
import { AppStateEnum, GameModel, GameStateEnum } from '../model/GameModel';
import { GameModelHelper } from '../model/GameModelHelper';
import { TimeSkipper } from '../utils/TimeSkipper';
import { vueService } from '../vue/VueService';
import { BackgroundController } from './BackgroundController';
import { BaseController } from './BaseController';
import { GameController } from './GameController';

export class ApplicationController extends BaseController {

    private gameModel?: GameModel;

    protected async doExecute() {
        this.gameModel = dataService.getRootModel<GameModel>().data;

        // this.setupSdkService();
        stageService.updateSignal.add(this.update);
        
        new BackgroundController().execute();
        await new PrepareIconsCommand().execute();

        GameModelHelper.setApplicationState(AppStateEnum.START_SCREEN);
        await vueService.signalStartButton.future();

        await this.nextCicle();
    }

    private async nextCicle() {
        GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);

        // TODO внесение кастомных данных
        const level = GameModelHelper.getGameLevel();
        GameModelHelper.resetGameModelForNextLevel();
        GameModelHelper.setGameLevel(level + 1);

        const game = await new GameController().execute();
        const gameState = GameModelHelper.getGameState();
        if (gameState === GameStateEnum.GAME_VICTORY) {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_VICTORY);
        } else if (gameState === GameStateEnum.GAME_DEFEATE) {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_DEFEATED);
        } else if (gameState === GameStateEnum.GAME_NO_MORE_MOVES) {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_NO_MORE_MOVES);
        }
        await vueService.signalGameEndButton.future();

        game.destroy();

        GameModelHelper.setApplicationState(AppStateEnum.NONE);

        this.nextCicle();
    }

    private update = (time: number) => {
        this.gameModel.appStateTime += time;
    }
    

    private async setupSdkService() {
        await new TimeSkipper(10000).execute();
        const appState = GameModelHelper.getApplicationState();
        GameModelHelper.setApplicationState(AppStateEnum.PAUSE_WHILE_ADS);

        await new TimeSkipper(3000).execute();
        GameModelHelper.setApplicationState(appState);

        this.setupSdkService();
    }
}
