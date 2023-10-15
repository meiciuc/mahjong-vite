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

        const start = 2;
        const w = Config.ICON_IMAGE_WIDTH * .95 - 2 * start;
        const h = Config.ICON_IMAGE_HEIGHT * .95 - 2 * start;
        const r = Math.floor((w + h) / 2 * .25);
        const d = `M ${r} ${start} L ${w - r} ${start} Q ${w} ${start} ${w} ${r} L ${w} ${h - r} Q ${w} ${h} ${w - r} ${h} L ${r} ${h} Q ${start} ${h} ${start} ${h - r} L ${start} ${r} Q ${start} ${start} ${r} ${start}`;
        svgPath.setAttribute('d', d);
        return svg;
    }

    static ADD_SCORE_FOR_TRUE_MOVE = 200;
    static ADD_SCORE_FOR_FALSE_MOVE = -50;
    static MAX_GAME_LEVEL = 92;

    static DEV = true;
    static get DEV_SHOW_STATS() {
        return Config.DEV;
    }

    static DEV_USE_PRELOADER = true;
}
