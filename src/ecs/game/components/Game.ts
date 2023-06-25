import { Model } from '../../../core/mvc/model';
import { GameModel } from '../../../model/Model';

export class Game {
    constructor(readonly model: Model<GameModel> ) {}
}
