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
    static MAX_GAME_LEVEL = 92;
    static MIN_FULL_SCREEN_ADD_TIMEOUT = 3000;

    static DEV = window.location.href.toLowerCase().indexOf('localhost') > -1;
    static get DEV_SHOW_STATS() {
        return Config.DEV;
    }

    static DEV_USE_PRELOADER = true;
    static DEV_GAME_AUTHOMATIC = false;
}
