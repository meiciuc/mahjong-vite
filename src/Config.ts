export class Config {
    static readonly GAME_SIDES_MIN_SCALE = 4 / 5;
    static readonly GAME_WIDTH_DEFAULT = 1080;
    static readonly GAME_HEIGHT_DEFAULT = 1920;
    static GAME_WIDTH = Config.GAME_WIDTH_DEFAULT;
    static GAME_HEIGHT = Config.GAME_HEIGHT_DEFAULT;
    static readonly APPLICATION_BACKGROUND_COLOR = 0xF9F9F9;

    static ICON_IMAGE_WIDTH = 128;
    static ICON_IMAGE_HEIGHT = 128;

    static GRID_WIDTH = 4;
    static GRID_HEIGHT = 5;
    static GRID_EMPTY_VALUE = -1;

    static readonly ASSETST_ICONS_VERSION = 'v2';
    static readonly ASSETS_ICONS_NUMBER = (Config.GRID_WIDTH * Config.GRID_HEIGHT) / 2;

    static readonly CLICK_TIMEOUT = 300;
    static readonly GRID_BaCKGROUND_COLOR = 0xF9F9F9;
    static PATH_COLOR = 0xFA4A0C;
}
