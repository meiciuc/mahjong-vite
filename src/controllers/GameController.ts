import { Engine } from '@ash.ts/ash';
import { throwIfNull } from '../utils/throwIfNull';
import { stageService } from '../core/services/StageService';
import { DisplaySystem } from '../ecs/display/DisplaySystem';
import { EntityCreator } from '../ecs/EntityCreator';
import { GameLogic } from '../ecs/game/GameLogic';
import { GameSystem } from '../ecs/game/GameSystem';
import { GridViewSystem } from '../ecs/game/GridViewSystem';
import { HelpSystem } from '../ecs/game/HelpSystem';
import { GameNode } from '../ecs/game/nodes/GameNode';
import { TileInteractiveSystem } from '../ecs/tiles/TileInteractiveSystem';
import { TilesGridSystem } from '../ecs/tiles/TilesGridSystem';
import { LAYERS } from '../GameLayers';
import { GridView } from '../view/GridView';
import { BaseController } from './BaseController';
import { dataService } from '../core/services/DataService';
import { GameModel, GameStateEnum } from '../model/GameModel';
import { GameTimerSystem } from '../ecs/timer/GameTimerSystem';
import { ModelHelper } from '../model/ModelHelper';
import { AnimationSystem } from '../ecs/animation/AnimationSystem';

export enum SystemPriorities {
    preUpdate = 1,
    update = 2,
    move = 3,
    resolveCollisions = 4,
    animate = 5,
    render = 6,
    audio = 7,
}

export class GameController extends BaseController {
    private creator?: EntityCreator;
    private engine?: Engine;
    private gridView?: GridView;
    private gameLogic?: GameLogic;

    destroy(): void {
        stageService.updateSignal.remove(this.update);
        this.engine?.removeAllSystems();
        this.gridView?.destroy();
    }

    protected async doExecute() {
        this.setupView();
        this.setupEngine();
    }

    protected complete(): void {
        super.complete();
    }

    private setupView() {
        this.gridView = new GridView();
        stageService.getLayer(LAYERS.GAME).addChild(this.gridView);
    }

    private async setupEngine() {
        this.engine = new Engine();
        this.gameLogic = new GameLogic(this.engine);
        this.creator = new EntityCreator(this.engine, throwIfNull(this.gridView));

        const keys: string[] = [];
        const icons = dataService.getRootModel<GameModel>().data.icons;
        icons.forEach((icon) => {
            keys.push(icon.key);
        });

        this.engine.addSystem(new GameSystem(this.creator, this.gameLogic), SystemPriorities.preUpdate);
        this.engine.addSystem(new GridViewSystem(this.getGridView()), SystemPriorities.update);
        this.engine.addSystem(new TilesGridSystem(), SystemPriorities.update);
        this.engine.addSystem(new GameTimerSystem(), SystemPriorities.update);

        this.engine.addSystem(new TileInteractiveSystem(this.creator), SystemPriorities.move);
        this.engine.addSystem(new HelpSystem(this.creator, this.gameLogic), SystemPriorities.move);

        this.engine.addSystem(new AnimationSystem(), SystemPriorities.animate);

        this.engine.addSystem(new DisplaySystem(), SystemPriorities.render);

        stageService.updateSignal.add(this.update);
        ModelHelper.setGameState(GameStateEnum.NONE);

        this.creator.createGame();
    }

    update = (time: number) => {
        this.engine?.update(time);

        if (this.gameIsOver()) {
            this.complete();
        }
    };

    private getGridView() {
        if (!this.gridView) {
            throw new Error('Error: this.gridView is undefined');
        }
        return this.gridView;
    }

    private gameIsOver() {
        const state = this.engine?.getNodeList(GameNode).head?.game.model.data.gameState;
        return state === GameStateEnum.GAME_DEFEATE || state === GameStateEnum.GAME_VICTORY || state === GameStateEnum.GAME_NO_MORE_MOVES;
    }
}
