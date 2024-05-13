import { Config } from "../Config";
import { dataService } from "../core/services/DataService";
import { GameModel } from "../model/GameModel";
import { SaveData, adsService } from "./AdsService";

class SaveDataService {

    saveData() {
        console.log('saveData')
        if (Config.DEV_PREVIEW_GAMEPLAY_MODE || Config.DEV_GAME_AUTHOMATIC) {
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
        let data = adsService.getData() as SaveData;
        if (data) {
            return data;
        }

        return JSON.parse(localStorage.getItem('data')) as SaveData || null;
    }
}

export const saveDataService = new SaveDataService();