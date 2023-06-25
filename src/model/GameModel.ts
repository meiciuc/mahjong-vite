export enum GameStateEnum {
    NONE = 'none',
    PREPARE = 'prepare',
    CLICK_WAIT = 'clickWait',
    ANIMATION = 'animation',
    TIMEOUT = 'timeout',
    GAME_OVER = 'gameOver',
}

export enum AppStateEnum {
    NONE = 'none',
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