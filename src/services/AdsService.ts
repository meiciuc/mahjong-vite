import { Config } from "../Config";
import { dataService } from "../core/services/DataService";
import { Booster, BoosterType, GameModel, LeaderboardItem } from "../model/GameModel";
import { Languages } from "../utils/Localization";
import { isMobile } from "is-mobile";

export interface LeaderBoardFetch {
    abovePlayers: LeaderboardItem[];
    belowPlayers: LeaderboardItem[];
    topPlayers: LeaderboardItem[];
    player?: any,
    players: LeaderboardItem[];
}

export interface SaveData {
    level: number;
    points: number;
    score: number;
    boosters: { [key in BoosterType]?: Booster }
    sound: boolean;
}

class GpService {
    private gp;
    private fullScreenAdsTimestamp = 0;

    private TAG = 'global@score';
    private ID = 11818;


    async init() {
        if (!Config.DEV_USE_GP) {
            return;
        }
        let resolve;
        let reject;
        const promise = new Promise<GpService>((res, rej) => {
            resolve = res;
            reject = rej;
        });

        window['onGPInit'] = async (gp) => {
            this.gp = gp;
            this.status();
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

    gameStart() {
        this.gp?.gameStart();
    }

    gameplayStart() {
        this.gp?.gameplayStart();
    }

    gameplayStop() {
        this.gp?.gameplayStop();
    }

    getLanguage() {
        if (this.gp) {
            return this.gp.language;
        }

        const arr = window.location.hostname.toLowerCase().split('.');
        const ext = arr.length > 0 ? arr[arr.length - 1] : '';
        const keys = Object.keys(Languages);
        keys.forEach((key) => {
            if (key === ext) {
                return key;
            }
        });

        return Languages.en;
    }

    isMobile() {
        if (this.gp) {
            return this.gp.isMobile;
        }

        return isMobile();
    }

    private status() {
        if (!this.gp) {
            return;
        }
        console.log('this.gp.ads.isStickyAvailable', this.gp.ads.isStickyAvailable);
        console.log('this.gp.ads.isFullscreenAvailable', this.gp.ads.isFullscreenAvailable);
        console.log('this.gp.ads.isRewardedAvailable', this.gp.ads.isRewardedAvailable);
        console.log('this.gp.ads.isPreloaderAvailable', this.gp.ads.isPreloaderAvailable);
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

    private generateVariantValue(key: 'yesterday' | 'today' | 'always' = 'today') {
        const date = new Date();
        switch (key) {
            case 'yesterday':
                date.setDate(date.getDate() - 1);
                break;
            case "today":
                break;
            case "always":
                return key;
        }


        return date.toLocaleString('en', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
    }

    async showLeaderboard(key: 'yesterday' | 'today' | 'always' = 'today') {
        if (!this.gp) {
            return;
        }

        dataService.getRootModel<GameModel>().data.leaderboardSelected = key;

        const result = key === 'always'
            ? await this.gp.leaderboard.fetch({ orderBy: ["level", "points"], withMe: 'last', })
            : await this.gp.leaderboard.fetchScoped({
                // ID таблицы
                id: this.ID,
                // Tag таблицы
                tag: this.TAG,
                // Название области видимости
                variant: this.generateVariantValue(key),
                orderBy: ['level', 'points'],
                includeFields: ['level', 'points'],
                // Сортировка DESC / ASC, по умолчанию значение лидерборда
                order: 'DESC',
                // Количество игроков в списке, max - 100, по умолчанию значение лидерборда
                limit: 10,
                // Включить список полей игрока для отображения в таблице, помимо полей таблицы
                withMe: 'last',
                // Получить N ближайших игроков сверху и снизу, максимум 10
                showNearest: 5,
            });

        const leaderboard = dataService.getRootModel<GameModel>().data.leaderboardItems;
        leaderboard.splice(0);

        const player = result.player as LeaderboardItem;
        // const arr = player ? result.abovePlayers.concat([player]).concat(result.belowPlayers) : result.players;
        const arr = result.players ? result.players : [];

        for (let i = 0; i < arr.length; i++) {
            leaderboard.push({
                id: arr[i].id,
                name: arr[i].name,
                position: arr[i].position,
                points: arr[i].points,
                level: arr[i].level || 1,
                selected: player ? player.id === arr[i].id : false,
            })
        }

    }

    showShare() {
        if (!this.gp) {
            return;
        }
        this.gp.socials.share();
    }

    showInvite() {
        if (!this.gp) {
            return;
        }
        this.gp.socials.invite();
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

    async saveLeaderboard(level: number, points: number, score: number) {
        if (!this.gp! || !this.gp.player) {
            return;
        }

        await this.gp.leaderboard.publishRecord({
            // ID таблицы
            id: this.ID,
            // Tag таблицы
            tag: this.TAG,
            // Название области видимости
            variant: this.generateVariantValue('today'),
            // Перезаписать макисмальный рекорд?
            // По-умолчанию рекорд будет обновлен, если он побил предыдущий
            override: true,
            // Рекорд игрока, установите значения нужных полей лидерборда
            record: {
                score,
                points,
                level,
            },
        });
    }

    saveData(data: SaveData) {
        if (!this.gp! || !this.gp.player) {
            return;
        }

        this.gp.player.get('data');
        this.gp.player.set('data', JSON.stringify(data));
        this.gp.player.get('level');
        this.gp.player.set('level', data.level);
        this.gp.player.get('points');
        this.gp.player.set('points', data.points);
        this.gp.player.get('score');
        this.gp.player.set('score', data.score);
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

    get isRewardedAvaliable() {
        return this.gp?.ads.isRewardedAvailable || false;
    }

    get isShareAvaliable() {
        return this.gp?.socials.isSupportsNativeShare || false;
    }

    get isInviteAvaliable() {
        return this.gp?.socials.isSupportsNativeInvite || false;
    }
}

export const adsService = new GpService();