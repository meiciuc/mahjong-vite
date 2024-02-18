export enum UserActionAfterTheLastGame {
    DEFAULT = 'default',
    RETRY = 'retry',
    RESET = 'reset',
    PREVIOUS = 'previous',
}

export enum GameStateEnum {
    NONE = 'none',
    PREPARE = 'prepare',
    CLICK_WAIT = 'clickWait',
    GAME_VICTORY = 'gameVictory',
    GAME_DEFEATE = 'gameDefeate',
    GAME_NO_MORE_MOVES = 'gameNoMoreMoves',
}

export enum AppStateEnum {
    NONE = 'none',

    START_SCREEN_FIRST = 'startScreenFirst',
    START_SCREEN = 'startScreen',

    GAME_SCREEN = 'gameScreen',
    GAME_SCREEN_PAUSE = 'gameScreenPause',

    GAME_VICTORY = 'gameVictoryScreen',

    GAME_NO_MORE_MOVES = 'gameNoMoreMovesScreen',
    GAME_NO_MORE_MOVES_ADS = 'gameNoMoreMovesAds',

    GAME_DEFEAT = 'gameDefeateScreen',
    GAME_DEFEAT_ADS = 'gameDefeatedAds',
}

export interface IconState {
    key: string;
}

export enum BoosterType {
    HELP = 'help',
    TIME = 'time',
}

export interface BoosterHelp {
    current: number;
}

export interface BoosterTime {
    current: number;
}

export type Booster = BoosterHelp | BoosterTime;

export interface GameModel {
    appState: AppStateEnum;
    userActionAfterTheLastGame: UserActionAfterTheLastGame,

    optionsAreVisible: boolean,
    shopIsVisible: boolean,
    sound: boolean,

    gameState: GameStateEnum,
    gameAge: number,
    gameLevel: number,
    gameTotalScore: number,
    helpsCount: number,
    boosters: { [key in BoosterType]?: Booster },

    icons: IconState[];

    gridWidth: number,
    gridHeight: number,
    seed: string,
}