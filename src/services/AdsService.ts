import { Config } from "../Config";
import { dataService } from "../core/services/DataService";
import { Booster, BoosterType, GameModel } from "../model/GameModel";

interface SaveData {
    gameLevel: number;
    gameTotalScore: number;
    boosters: { [key in BoosterType]?: Booster }
    sound: boolean;
}

class GpService {
    private gp;
    private fullScreenAdsTimestamp = 0;

    async init() {
        let resolve;
        let reject;
        const promise = new Promise<GpService>((res, rej) => {
            resolve = res;
            reject = rej;
        });

        window['onGPInit'] = async (gp) => {
            this.gp = gp;
            this.setup();
            resolve(this);
        };

        const script = document.createElement('script');
        script.async = true;
        document.body.appendChild(script);
        script.src = "https://gamepush.com/sdk/game-score.js?projectId=5528&publicToken=N5lr0wrfWGfivCrjAQAIsHCG7Y4zuSGX&callback=onGPInit";

        script.onload = () => {
            // resolve();
        };

        script.onerror = () => {
            console.log('Error occurred while loading script');
            reject(this);
        };

        return promise;
    }

    private setup() {
        if (!this.gp) {
            return;
        }
        dataService.getRootModel<GameModel>().data.language = this.gp.language;

        console.log('this.gp.ads.isStickyAvailable', this.gp.ads.isStickyAvailable);

        console.log('this.gp.ads.isFullscreenAvailable', this.gp.ads.isFullscreenAvailable);
        console.log('this.gp.ads.isRewardedAvailable', this.gp.ads.isRewardedAvailable);
        console.log('this.gp.ads.isPreloaderAvailable', this.gp.ads.isPreloaderAvailable);
    }


    isRewardedAvaliable() {
        return this.gp?.ads.isRewardedAvailable || false;
    }

    async showRewarded() {
        if (!this.gp?.ads.isRewardedAvailable) {
            return Promise.reject();
        }

        return await this.gp.ads.showRewardedVideo();
    }

    showSticky(value: boolean) {
        if (!this.gp) {
            return;
        }

        if (value && this.gp.ads.isStickyAvailable) {
            this.gp.ads.showSticky();
        }

        if (!value) {
            this.gp.ads.closeSticky()
        }
    }

    showLeaderboard(value: boolean) {
        if (!this.gp) {
            return;
        }

        if (value) {
            this.gp.leaderboard.open();
        }
    }

    async showFullscreen() {
        if (!this.gp) {
            return Promise.reject();
        }

        if (Date.now() - this.fullScreenAdsTimestamp >= Config.MIN_FULL_SCREEN_ADD_TIMEOUT) {
            return Promise.reject();
        }

        this.fullScreenAdsTimestamp = Date.now();

        if (this.gp.ads.isFullscreenAvailable) {
            return this.gp.ads.showFullscreen();
        } else {
            return Promise.resolve();
        }
    }

    getAvatar() {
        if (!this.gp! || !this.gp.player) {
            return;
        }

        return this.gp.player.avatar;
    }

    saveData(data: SaveData) {
        if (!this.gp! || !this.gp.player) {
            return;
        }

        this.gp.player.get('data');
        this.gp.player.set('data', JSON.stringify(data));
        this.gp.player.set('score', data.gameTotalScore);
        this.gp.player.sync({ override: true });
    }

    getData() {
        if (!this.gp! || !this.gp.player) {
            return null;
        }

        if (!this.gp.player.has('data')) {
            return null;
        }

        const data = this.gp.player.get('data');
        return data ? JSON.parse(data) : null;
    }
}

export const adsService = new GpService();