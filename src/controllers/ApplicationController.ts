import { PrepareIconsCommand } from '../commands/PrepareIconsController';
import { AppStateEnum, GameStateEnum } from '../model/GameModel';
import { ModelHelper } from '../model/ModelHelper';
import { vueService } from '../vue/VueService';
import { BackgroundController } from './BackgroundController';
import { BaseController } from './BaseController';
import { GameController } from './GameController';

export class ApplicationController extends BaseController {
    protected async doExecute() {
        new BackgroundController().execute();
        await new PrepareIconsCommand().execute();

        ModelHelper.setApplicationState(AppStateEnum.START_SCREEN);
        await vueService.signalStartButton.future();

        await this.nextCicle();
    }

    private async nextCicle() {
        ModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);
        const game = await new GameController().execute();
        const gameState = ModelHelper.getGameState();
        if (gameState === GameStateEnum.GAME_VICTORY) {
            ModelHelper.setApplicationState(AppStateEnum.GAME_VICTORY);
        } else if (gameState === GameStateEnum.GAME_DEFEATE) {
            ModelHelper.setApplicationState(AppStateEnum.GAME_DEFEATE);
        } else if (gameState === GameStateEnum.GAME_NO_MORE_MOVES) {
            ModelHelper.setApplicationState(AppStateEnum.GAME_NO_MORE_MOVES);
        }
        await vueService.signalGameEndButton.future();

        game.destroy();

        ModelHelper.setApplicationState(AppStateEnum.NONE);
        this.nextCicle();
    }
}
