import { BaseController } from './BaseController';
import { GameController } from './GameController';
import { BackgroundController } from './BackgroundController';
import { PrepareIconsCommand } from '../commands/PrepareIconsController';
import { dataService } from '../core/services/DataService';
import { AppStateEnum, GameModel } from '../model/GameModel';
import { vueService } from '../vue/VueService';

export class ApplicationController extends BaseController {
    protected async doExecute() {
        new BackgroundController().execute();
        await new PrepareIconsCommand().execute();
        await this.nextCicle();
    }

    private async nextCicle() {
        const gameModel = dataService.getRootModel<GameModel>();
        gameModel.data.appState = AppStateEnum.START_SCREEN;
        await vueService.signalStartButton.future();

        gameModel.data.appState = AppStateEnum.GAME_SCREEN;
        const game = await new GameController().execute();
        game.destroy();

        gameModel.data.appState = AppStateEnum.GAME_VICTORY;
        await vueService.signalGameEndButton.future();

        gameModel.data.appState = AppStateEnum.NONE;
        this.nextCicle();
    }
}
