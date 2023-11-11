import { PrepareIconsCommand } from '../commands/PrepareIconsCommand';
import { dataService } from '../core/services/DataService';
import { stageService } from '../core/services/StageService';
import { AppStateEnum, GameModel, GameStateEnum } from '../model/GameModel';
import { GameModelHelper } from '../model/GameModelHelper';
import { addService } from '../services/AddService';
import { vueService } from '../vue/VueService';
import { BackgroundController } from './BackgroundController';
import { BaseController } from './BaseController';
import { GameController } from './GameController';

export class ApplicationController extends BaseController {

    private gameModel?: GameModel;

    protected async doExecute() {
        this.gameModel = dataService.getRootModel<GameModel>().data;

        stageService.updateSignal.add(this.update);

        new BackgroundController().execute();
        await new PrepareIconsCommand().execute();

        GameModelHelper.setApplicationState(AppStateEnum.START_SCREEN);

        addService.showLeaderboard(true);

        addService.showSticky(true);
        await vueService.signalStartButton.future();
        addService.showSticky(false);

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
            addService.showSticky(true);
            GameModelHelper.setApplicationState(AppStateEnum.GAME_VICTORY);
        } else if (gameState === GameStateEnum.GAME_DEFEATE) {
            addService.showSticky(true);
            GameModelHelper.setApplicationState(AppStateEnum.GAME_DEFEATED);
        } else if (gameState === GameStateEnum.GAME_NO_MORE_MOVES) {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_NO_MORE_MOVES);
        }
        await vueService.signalGameEndButton.future();
        addService.showSticky(false);

        game.destroy();

        GameModelHelper.setApplicationState(AppStateEnum.NONE);

        this.nextCicle();
    }

    private update = (time: number) => {
        this.gameModel.appStateTime += time;
    }
}
