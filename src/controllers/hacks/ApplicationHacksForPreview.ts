import { dataService } from "../../core/services/DataService";
import { BoosterType, GameModel } from "../../model/GameModel";
import { GameModelHelper } from "../../model/GameModelHelper";

export class ApplicationHacksForPreview {

    static setupPreviewModel() {
        const gameModel = dataService.getRootModel<GameModel>();

        gameModel.data.gameLevel = 50;
        gameModel.data.gameScore = 1000;
        gameModel.data.sound = false;

        GameModelHelper.setBooster(BoosterType.TIME, 3);
        GameModelHelper.setBooster(BoosterType.HELP, 2);

        const keys: string[] = [];
        const icons = gameModel.data.icons;
        icons.forEach((icon) => {
            keys.push(icon.key);
        });

        // gameModel.subscribe(['appState'], this.handleGameModelStateChange);
        // gameModel.subscribe(['boosters'], this.handleBoosters);

        return gameModel;
    }
}