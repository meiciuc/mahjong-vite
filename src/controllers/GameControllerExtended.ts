import { dataService } from "../core/services/DataService";
import { GameLogic } from "../ecs/game/GameLogic";
import { GameModel } from "../model/GameModel";
import { GameController } from "./GameController";

export class GameControllerExtended extends GameController {

    protected setupGameLogic() {
        this.gameLogic = new GameLogic(this.engine);

        const config = this.gameLogic.getDefaultGenerateIconsConfig();
        config.gridWidth = 4;
        config.gridHeight = 5;
        config.seed = '0.6440902038163674';
        config.currentLevel = 4;
        config.pares = 1;

        console.log('SEEEEEEEEEEED', config.seed)

        const model = dataService.getRootModel<GameModel>();
        model.data.gameLevel = config.currentLevel;
        model.data.gridWidth = config.gridWidth;
        model.data.gridHeight = config.gridHeight;
        model.data.seed = config.seed;
        model.data.gameAge = 60;

        this.gameLogic.generateIconsQueue(config);
    }

    update = (time: number) => {
        this.engine?.update(time);

        dataService.getRootModel<GameModel>().data.gameAge -= time;
        if (dataService.getRootModel<GameModel>().data.gameAge < 4) {
            dataService.getRootModel<GameModel>().data.gameAge = 4;
        }
    };

}