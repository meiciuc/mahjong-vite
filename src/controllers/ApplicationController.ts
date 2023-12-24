import { PrepareIconsCommand } from '../commands/PrepareIconsCommand';
import { Model } from '../core/mvc/model';
import { dataService } from '../core/services/DataService';
import { stageService } from '../core/services/StageService';
import { AppStateEnum, GameModel, GameStateEnum } from '../model/GameModel';
import { GameModelHelper } from '../model/GameModelHelper';
import { addService } from '../services/AddService';
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

        addService.showLeaderboard(true);

        addService.showSticky(true);
        await vueService.signalStartButton.future();
        addService.showSticky(false);

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

    private setupGameModel() {
        // TODO внесение кастомных данных
        this.gameModel = dataService.getRootModel<GameModel>();
        const keys: string[] = [];
        const icons = this.gameModel.data.icons;
        icons.forEach((icon) => {
            keys.push(icon.key);
        });
    }

    private update = (time: number) => {
        this.gameModel.data.appStateTime += time;
    }


    // private async setupSdkService() {
    //     await new TimeSkipper(10000).execute();
    //     const appState = GameModelHelper.getApplicationState();
    //     GameModelHelper.setApplicationState(AppStateEnum.PAUSE_WHILE_ADS);

    //     await new TimeSkipper(3000).execute();
    //     GameModelHelper.setApplicationState(appState);

    //     this.setupSdkService();
    // }
}
