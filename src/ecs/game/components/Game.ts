import { GameState } from '../../../states/GameState';
import { GameStateEnum } from '../GameStateEnum';

export class Game {
    public stateTime = 0;
    public state = GameStateEnum.NONE;
    constructor(public gameState: GameState) {}
}
