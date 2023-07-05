export enum GameStateEnum {
    NONE = 'none',
    PREPARE = 'prepare',
    CLICK_WAIT = 'clickWait',
    ANIMATION = 'animation',
    TIMEOUT = 'timeout',
    GAME_VICTORY = 'gameVictory',
    GAME_DEFEATE = 'gameDefeate',
    GAME_NO_MORE_MOVES = 'gameNoMoreMoves',
}

export enum AppStateEnum {
    NONE = 'none',
    START_SCREEN = 'startScreen',
    GAME_SCREEN = 'gameScreen',
    GAME_VICTORY = 'gameVictoryScreen',
    GAME_DEFEATE = 'gameDefeateScreen',
    GAME_NO_MORE_MOVES = 'gameNoMoreMovesScreen',
}

export interface IconState {
    key: string;
}

export interface GameModel {
    icons: IconState[];
    appState: AppStateEnum;
    appStateTime: 0,
    gameState: GameStateEnum,
    gameStateTime: 0,
}