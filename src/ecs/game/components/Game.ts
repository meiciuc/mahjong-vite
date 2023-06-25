import { Model } from '../../../core/mvc/model';
import { GameModel } from '../../../model/GameModel';

export class Game {
    constructor(readonly model: Model<GameModel> ) {}
}
