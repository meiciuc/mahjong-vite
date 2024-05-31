import { Config } from "../Config";
import { dataService } from "../core/services/DataService";
import { GameModel } from "../model/GameModel";
import { SaveData, adsService } from "./AdsService";

class SaveDataService {

    private score = (level: number, points: number) => level * 1000000000 + points;

    saveLeaderboard() {
        if (!Config.DEV_SAVE_RESULT) {
            return;
        }

        const model = dataService.getRootModel<GameModel>().data;
        adsService.saveLeaderboard(model.level, model.points, this.score(model.level, model.points));
    }

    saveData() {
        if (!Config.DEV_SAVE_RESULT) {
            return;
        }

        const model = dataService.getRootModel<GameModel>().data;
        localStorage.setItem('data', JSON.stringify(model));

        adsService.saveData({
            level: model.level,
            points: model.points,
            score: this.score(model.level, model.points),
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