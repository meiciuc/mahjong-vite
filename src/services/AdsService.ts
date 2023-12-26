import { dataService } from "../core/services/DataService";
import { GameModel } from "../model/GameModel";

class GpService {
    private gp;

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
        dataService.getRootModel<GameModel>().data.language = this.gp.language;

        console.log('this.gp.ads.isStickyAvailable', this.gp.ads.isStickyAvailable);

        console.log('this.gp.ads.isFullscreenAvailable', this.gp.ads.isFullscreenAvailable);
        console.log('this.gp.ads.isRewardedAvailable', this.gp.ads.isRewardedAvailable);
        console.log('this.gp.ads.isPreloaderAvailable', this.gp.ads.isPreloaderAvailable);

        // if (this.gp.ads.isStickyAvailable) {
        //     this.gp.ads.showSticky();
        // }
    }

    public showSticky(value: boolean) {
        if (value && this.gp.ads.isStickyAvailable) {
            this.gp.ads.showSticky();
        }

        if (!value) {
            this.gp.ads.closeSticky()
        }
    }

    public showLeaderboard(value: boolean) {
        if (value) {
            this.gp.leaderboard.open();
        }
    }

    public async showFullscreen() {
        if (this.gp.ads.isFullscreenAvailable) {
            return this.gp.ads.showFullscreen();
        } else {
            return Promise.resolve();
        }
    }
}

export const adsService = new GpService();