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

        GameModelHelper.setApplicationState(AppStateEnum.START_SCREEN_FIRST);

        await vueService.signalStartButton.future();

        await this.nextCycle(Math.max(GameModelHelper.getGameLevel(), 1));
    }

    private async nextCycle(level: number) {
        GameModelHelper.setApplicationState(AppStateEnum.GAME_SCREEN);

        GameModelHelper.resetGameModelForNextLevel();
        GameModelHelper.setGameLevel(level);

        // await new TutorialController().execute();

        const game = await new GameController().execute();
        game.destroy();

        let nextLevel: number;
        const gameState = GameModelHelper.getGameState();
        if (gameState === GameStateEnum.GAME_VICTORY) {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_VICTORY);
            nextLevel = level + 1;
        } else if (gameState === GameStateEnum.GAME_DEFEATE) {
            GameModelHelper.setApplicationState(GameModelHelper.getGameLevel() < 10 ? AppStateEnum.GAME_DEFEATED : AppStateEnum.GAME_DEFEATED_ADS);
            nextLevel = level;
        } else {
            GameModelHelper.setApplicationState(AppStateEnum.GAME_NO_MORE_MOVES);
            nextLevel = level;
        }

        await vueService.signalGameEndButton.future();

        GameModelHelper.setApplicationState(AppStateEnum.NONE);

        this.nextCycle(nextLevel);
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
            case AppStateEnum.START_SCREEN:
            case AppStateEnum.GAME_SCREEN_PAUSE:
                adsService.showSticky(true);
                break;
            case AppStateEnum.GAME_SCREEN:
                adsService.showSticky(false);
                break;
        }
    }
}
