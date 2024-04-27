import { dataService } from "../core/services/DataService";
import { GameModel } from "../model/GameModel";
import { adsService } from "./AdsService";

class SaveDataService {

    saveData() {
        const model = dataService.getRootModel<GameModel>().raw;
        localStorage.setItem('data', JSON.stringify(model));

        adsService.saveData({
            gameLevel: model.gameLevel,
            gameTotalScore: model.gameTotalScore,
            sound: model.sound,
            boosters: model.boosters,
        });
    }

    getData() {
        let data = adsService.getData();
        if (data) {
            return data;
        }

        data = localStorage.getItem('data');
        return data ? JSON.parse(data) : null;
    }
}

export const saveDataService = new SaveDataService();