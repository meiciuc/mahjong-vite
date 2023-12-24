import { PrepareIconsCommand } from '../commands/PrepareIconsCommand';
import { Model } from '../core/mvc/model';
import { dataService } from '../core/services/DataService';
import { stageService } from '../core/services/StageService';
import { AppStateEnum, GameModel, GameStateEnum } from '../model/GameModel';
import { GameModelHelper } from '../model/GameModelHelper';
import { adsService } from '../services/AdsService';
import { vueService } from '../vue/VueService';
import { BackgroundController } from './BackgroundController';
import { BaseController } from './BaseController';
import { GameController } from './GameController';
import { TutorialController } from './TutorialController';

export class ApplicationController extends BaseController {

    private gameModel?: Model<GameModel>;

    protected async doExecute() {
        this.setupGameModel();

        stageService.updateSignal.add(this.update);

        new BackgroundController().execute();
        await new PrepareIconsCommand().execute();

        GameModelHelper.setApplicationState(AppStateEnum.START_SCREEN);

        // adsService.showLeaderboard(true);

        adsService.showSticky(true);
        await vueService.signalStartButton.future();
        adsService.showSticky(false);

        await this.nextCicle();
    }

    private async nextCicle() {
        GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);

        const level = GameModelHelper.getGameLevel();
        GameModelHelper.resetGameModelForNextLevel();
        GameModelHelper.setGameLevel(level + 1);

        // await new TutorialController().execute();

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

    private setupGameModel() {
        // TODO внесение кастомных данных
        this.gameModel = dataService.getRootModel<GameModel>();
        const keys: string[] = [];
        const icons = this.gameModel.data.icons;
        icons.forEach((icon) => {
            keys.push(icon.key);
        });

        this.gameModel.subscribe(['appState'], this.handleGameModelStateChange);
    }

    private update = (time: number) => {

    }

    private handleGameModelStateChange = (currenState: AppStateEnum, oldState: AppStateEnum) => {
        switch (currenState) {
            case AppStateEnum.GAME_SCREEN_PAUSE:
                adsService.showSticky(true);
                break;
            case AppStateEnum.GAME_SCREEN:
                adsService.showSticky(false);
                break;
        }
    }
}
