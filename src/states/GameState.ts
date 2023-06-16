export interface IconState {
    key: string;
}

export interface GameState {
    icons: IconState[];
}

const gameState: GameState = {
    icons: [],
};

export const getGameState = () => {
    return gameState;
};
