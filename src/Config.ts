import { dataService } from "./core/services/DataService";
import { BoosterType, GameModel } from "./model/GameModel";
import { GameModelHelper } from "./model/GameModelHelper";
import { Languages } from "./utils/Localization";

export class Config {
    static readonly APPLICATION_BACKGROUND_COLOR = 0xFFFFFF;

    static ICON_IMAGE_WIDTH = 128;
    static ICON_IMAGE_HEIGHT = 128;

    static GRID_EMPTY_VALUE = -1;

    static readonly ASSETST_ICONS_VERSION = 'v2';

    static readonly CLICK_TIMEOUT = 300;
    static readonly GRID_BaCKGROUND_COLOR = Config.APPLICATION_BACKGROUND_COLOR;
    static PATH_LIKE_SNAKE_DURATION = .3;
    static PATH_HELP_COLOR = 0xFA4A0C;
    static PATH_SELECT_COLOR = 0xCDCDCD;
    static get PATH_TILE_SVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgPath.setAttribute('style', "fill: none; stroke: #fff; stroke-width: 1");

        svg.appendChild(svgPath);

        const padding = 4;
        const w = Config.ICON_IMAGE_WIDTH * 1.20 - 2 * padding;
        const h = Config.ICON_IMAGE_HEIGHT * 1.20 - 2 * padding;
        const r = Math.floor((w + h) / 2 * .25);
        const d = `M ${padding + r} ${padding} L ${padding + w - r} ${padding} Q ${padding + w} ${padding} ${padding + w} ${padding + r} L ${padding + w} ${padding + h - r} Q ${padding + w} ${padding + h} ${padding + w - r} ${padding + h} L ${padding + r} ${padding + h} Q ${padding} ${padding + h} ${padding} ${padding + h - r} L ${padding} ${padding + r} Q ${padding} ${padding} ${padding + r} ${padding}`;
        svgPath.setAttribute('d', d);
        return svg;
    }

    static PARTICLE_KEY = `./assets/particle.png`;
    static PARTICLE_SCALE = 0.2;

    static ADD_SCORE_FOR_TRUE_MOVE = 1;
    static ADD_SCORE_FOR_FALSE_MOVE = -1;
    static MAX_GAME_LEVEL = 100;
    static MIN_FULL_SCREEN_ADD_TIMEOUT = 3000;

    static DEV = window.location.href.toLowerCase().indexOf('localhost') > -1;
    static get DEV_SHOW_STATS() {
        return false;//Config.DEV;
    }

    static DEV_USE_PRELOADER = true;
    static DEV_HELP_LOGIC_IS_RANDOM = true;

    static DEV_PREVIEW_GAMEPLAY_MODE = false;
    static DEV_CLCIK_EFFECT_DELAY = 1500;
    static DEV_GAME_AUTHOMATIC = false;
    static DEV_USE_GP = true;
    static DEV_FULLSCREEN = false;
    static DEV_TIMER_KOEFFICIENT = 1;
    static DEV_LANG = Config.DEV_PREVIEW_GAMEPLAY_MODE ? Languages.ru : undefined;
    static DEV_AUTOSTART_FOR_PREVIEW = false;
    static DEV_GET_LONGEST_PATH_HELP_RESULT = false;
    static DEV_GET_SHORTEST_PATH_HELP_RESULT = false;
    static DEV_RESET_GP = false;

    private static currentPreviewState = 1;

    static setupPreviewModel() {
        const gameModel = dataService.getRootModel<GameModel>();

        switch (Config.currentPreviewState) {
            case 0:
                gameModel.data.gameLevel = 1;
                gameModel.data.gameScore = 0;
                gameModel.data.sound = false;
                gameModel.data.seed = `${Date.now()}`;

                GameModelHelper.setBooster(BoosterType.TIME, 3);
                GameModelHelper.setBooster(BoosterType.HELP, 3);
                break;
            case 1:
                gameModel.data.gameLevel = 4;
                gameModel.data.gameScore = 367;
                gameModel.data.sound = false;
                gameModel.data.seed = '1716292045129';

                GameModelHelper.setBooster(BoosterType.TIME, 3);
                GameModelHelper.setBooster(BoosterType.HELP, 2);
                break;
            case 2:
                gameModel.data.gameLevel = 23;
                gameModel.data.gameScore = 2067;
                gameModel.data.sound = false;
                gameModel.data.seed = 's1';

                GameModelHelper.setBooster(BoosterType.TIME, 9);
                GameModelHelper.setBooster(BoosterType.HELP, 11);
                break;
            case 3:
                gameModel.data.gameLevel = 71;
                gameModel.data.gameScore = 39667;
                gameModel.data.sound = false;
                gameModel.data.seed = `s2`;

                GameModelHelper.setBooster(BoosterType.TIME, 23);
                GameModelHelper.setBooster(BoosterType.HELP, 12);
                break;
            case 4:
                gameModel.data.gameLevel = 98;
                gameModel.data.gameScore = 539167;
                gameModel.data.sound = false;
                gameModel.data.seed = `s2`;

                GameModelHelper.setBooster(BoosterType.TIME, 9);
                GameModelHelper.setBooster(BoosterType.HELP, 2);
                break;
            case 5:
                gameModel.data.gameLevel = 213;
                gameModel.data.gameScore = 9398167;
                gameModel.data.sound = false;
                gameModel.data.seed = `s2`;

                GameModelHelper.setBooster(BoosterType.TIME, 9);
                GameModelHelper.setBooster(BoosterType.HELP, 2);
                break;
        }
    }

    private static state() {
        Config.DEV_PREVIEW_GAMEPLAY_MODE = true;
        Config.DEV_FULLSCREEN = false;
        Config.DEV_USE_GP = false;
        Config.DEV_LANG = Languages.ru;//Config.DEV_PREVIEW_GAMEPLAY_MODE ? Languages.ru : undefined;
        Config.DEV_GAME_AUTHOMATIC = true;//Config.DEV_PREVIEW_GAMEPLAY_MODE;
        Config.DEV_AUTOSTART_FOR_PREVIEW = true;
        Config.DEV_GET_LONGEST_PATH_HELP_RESULT = true;
        Config.DEV_GET_SHORTEST_PATH_HELP_RESULT = false;

        switch (Config.currentPreviewState) {
            case 0:
                Config.DEV_RESET_GP = true;
                Config.DEV_PREVIEW_GAMEPLAY_MODE = false;
                Config.DEV_FULLSCREEN = false;
                Config.DEV_USE_GP = true;
                Config.DEV_LANG = Config.DEV_PREVIEW_GAMEPLAY_MODE ? Languages.ru : undefined;
                Config.DEV_GAME_AUTHOMATIC = false;//Config.DEV_PREVIEW_GAMEPLAY_MODE;
                Config.DEV_AUTOSTART_FOR_PREVIEW = false;
                Config.DEV_GET_LONGEST_PATH_HELP_RESULT = false;
                Config.DEV_GET_SHORTEST_PATH_HELP_RESULT = false;
                Config.DEV_HELP_LOGIC_IS_RANDOM = true;
                Config.DEV_CLCIK_EFFECT_DELAY = Config.DEV_PREVIEW_GAMEPLAY_MODE ? 100 : 1500;
                Config.DEV_TIMER_KOEFFICIENT = Config.DEV_PREVIEW_GAMEPLAY_MODE ? 60 : 1;
                break;
            case 1:
                Config.DEV_HELP_LOGIC_IS_RANDOM = true;
                Config.DEV_CLCIK_EFFECT_DELAY = 500;//Config.DEV_PREVIEW_GAMEPLAY_MODE ? 100 : 1500;
                Config.DEV_TIMER_KOEFFICIENT = 1 // Config.DEV_PREVIEW_GAMEPLAY_MODE ? 60 : 1;
                break;
            case 2:
                Config.DEV_HELP_LOGIC_IS_RANDOM = false;
                Config.DEV_CLCIK_EFFECT_DELAY = 300;//Config.DEV_PREVIEW_GAMEPLAY_MODE ? 100 : 1500;
                Config.DEV_TIMER_KOEFFICIENT = 10 // Config.DEV_PREVIEW_GAMEPLAY_MODE ? 60 : 1;
                break;
            case 3:
                Config.DEV_HELP_LOGIC_IS_RANDOM = false;
                Config.DEV_CLCIK_EFFECT_DELAY = 100;//Config.DEV_PREVIEW_GAMEPLAY_MODE ? 100 : 1500;
                Config.DEV_TIMER_KOEFFICIENT = 48; // Config.DEV_PREVIEW_GAMEPLAY_MODE ? 60 : 1;
                Config.DEV_GET_LONGEST_PATH_HELP_RESULT = false;
                Config.DEV_GET_SHORTEST_PATH_HELP_RESULT = true;
                break;
            case 4:
                Config.DEV_HELP_LOGIC_IS_RANDOM = false;
                Config.DEV_CLCIK_EFFECT_DELAY = 20;//Config.DEV_PREVIEW_GAMEPLAY_MODE ? 100 : 1500;
                Config.DEV_TIMER_KOEFFICIENT = 71; // Config.DEV_PREVIEW_GAMEPLAY_MODE ? 60 : 1;
                Config.DEV_GET_LONGEST_PATH_HELP_RESULT = false;
                Config.DEV_GET_SHORTEST_PATH_HELP_RESULT = true;
                break;
            case 5:
                Config.DEV_HELP_LOGIC_IS_RANDOM = false;
                Config.DEV_CLCIK_EFFECT_DELAY = 5;//Config.DEV_PREVIEW_GAMEPLAY_MODE ? 100 : 1500;
                Config.DEV_TIMER_KOEFFICIENT = 121; // Config.DEV_PREVIEW_GAMEPLAY_MODE ? 60 : 1;
                Config.DEV_GET_LONGEST_PATH_HELP_RESULT = false;
                Config.DEV_GET_SHORTEST_PATH_HELP_RESULT = true;
                break;
        }
    }

    constructor() {
        Config.currentPreviewState = 0;
        Config.state();
    }
}

// new Config();
