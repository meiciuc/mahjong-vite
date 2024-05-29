import { Config } from "../Config";
import { dataService } from "../core/services/DataService";
import { GameModel } from "../model/GameModel";
import { SaveData, adsService } from "./AdsService";

class SaveDataService {

    saveData() {
        if (!Config.DEV_SAVE_RESULT) {
            return;
        }

        const model = dataService.getRootModel<GameModel>().raw;
        localStorage.setItem('data', JSON.stringify(model));

        adsService.saveData({
            gameLevel: model.gameLevel,
            gameScore: model.gameScore,
            sound: model.sound,
            boosters: model.boosters,
        });
    }

    getData() {
        if (Config.DEV_RESET_GP) {
            return null;
        }

        let data = adsService.getData() as SaveData;
        if (data) {
            return data;
        }

        return JSON.parse(localStorage.getItem('data')) as SaveData || null;
    }
}

export const saveDataService = new SaveDataService();