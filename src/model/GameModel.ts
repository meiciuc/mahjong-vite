
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
    START_SCREEN = 'startScreen',
    GAME_SCREEN = 'gameScreen',
    GAME_VICTORY = 'gameVictoryScreen',
    GAME_DEFEATED = 'gameDefeateScreen',
    GAME_NO_MORE_MOVES = 'gameNoMoreMovesScreen',
    PAUSE_WHILE_ADS = 'pauseWhileAds',
}

export interface IconState {
    key: string;
}

export interface GameModel {
    appState: AppStateEnum;
    appStateTime: number,
    gameState: GameStateEnum,
    gameStateTime: number,
    gameLevel: number,
    gameScore: number,
    gameMaxTime: number,
    helpsCount: number,

    icons: IconState[];
    maxGridItems: number,
}