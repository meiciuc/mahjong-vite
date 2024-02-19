import { dataService } from "../core/services/DataService";
import { GameModel } from "../model/GameModel";
import { adsService } from "./AdsService";

class SaveDataService {

    saveData() {
        const model = dataService.getRootModel<GameModel>().raw;
        localStorage.setItem('data', JSON.stringify(model));

        console.log('model.boosters', model.boosters)

        adsService.saveData({
            gameLevel: model.gameLevel,
            gameTotalScore: model.gameTotalScore,
            sound: model.sound,
            boosters: model.boosters,
        });
    }

    getData() {
        const data = localStorage.getItem('data');
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    }
}

export const saveDataService = new SaveDataService();