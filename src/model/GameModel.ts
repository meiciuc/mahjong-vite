import { Languages } from "../utils/Localization";

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
    START_SCREEN_NOVICE = 'startScreenNovice',
    START_SCREEN = 'startScreen',

    GAME_SCREEN = 'gameScreen',
    GAME_SCREEN_PAUSE = 'gameScreenPause',

    GAME_VICTORY = 'gameVictoryScreen',
    GAME_VICTORY_NEXT_CHOOSING = 'gameVictoryScreenNextChoosing',

    GAME_NO_MORE_MOVES = 'gameNoMoreMovesScreen',
    GAME_NO_MORE_MOVES_ADS = 'gameNoMoreMovesAds',
    GAME_NO_MORE_MOVES_CHOOSING = 'gameNoMoreMovesChoosing',

    GAME_DEFEATED = 'gameDefeateScreen',
    GAME_DEFEATED_ADS = 'gameDefeatedAds',
    GAME_DEFEATED_CHOOSING = 'gameDefetedChoosing',
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

    pause: boolean,
    language: Languages,
}