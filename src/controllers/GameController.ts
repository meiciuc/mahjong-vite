import { Engine } from '@ash.ts/ash';
import { throwIfNull } from '../utils/throwIfNull';
import { stageService } from '../core/services/StageService';
import { DisplaySystem } from '../ecs/display/DisplaySystem';
import { EntityCreator } from '../ecs/EntityCreator';
import { GameLogic } from '../ecs/game/GameLogic';
import { GameStateEnum } from '../ecs/game/GameStateEnum';
import { GameSystem } from '../ecs/game/GameSystem';
import { GridViewSystem } from '../ecs/game/GridViewSystem';
import { HelpViewSystem } from '../ecs/game/HelpViewSystem';
import { GameNode } from '../ecs/game/nodes/GameNode';
import { TileImageSelectedEffectSystem } from '../ecs/tiles/TileImageSelectedEffectSystem';
import { TileInteractiveSystem } from '../ecs/tiles/TileInteractiveSystem';
import { TilesGridSystem } from '../ecs/tiles/TilesGridSystem';
import { LAYERS } from '../GameLayers';
import { GridView } from '../view/GridView';
import { BaseController } from './BaseController';
import { getGameState } from '../states/GameState';

export class GameController extends BaseController {
    private creator?: EntityCreator;
    private engine?: Engine;
    private gridView?: GridView;
    private gameLogic?: GameLogic;

    protected async doExecute() {
        this.setup();
        this.setupView();
        this.setupEngine();
    }

    protected complete(): void {
        stageService.updateSignal.remove(this.update);
        this.engine?.removeAllSystems();
        this.gridView?.destroy();

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
        const state = getGameState();
        state.icons.forEach((icon) => {
            keys.push(icon.key);
        });
        await this.creator.prepareIconTexures(keys);

        this.engine.addSystem(new GameSystem(this.creator, this.gameLogic), 1);
        this.engine.addSystem(new GridViewSystem(this.getGridView()), 9);
        this.engine.addSystem(new DisplaySystem(), 10);
        this.engine.addSystem(new TileInteractiveSystem(this.creator), 1);
        this.engine.addSystem(new TileImageSelectedEffectSystem(), 1);
        this.engine.addSystem(new TilesGridSystem(), 1);

        this.engine.addSystem(new HelpViewSystem(this.creator, this.gameLogic), 1);

        stageService.updateSignal.add(this.update);

        this.creator.createGame();
    }

    private setup() {
        stageService.updateSignal.add(this.update);
    }

    update = (time: number) => {
        this.engine?.update(time);

        if (this.engine?.getNodeList(GameNode).head?.game.state === GameStateEnum.GAME_OVER) {
            console.log('gameOver');
            this.complete();
        }
    };

    private getGridView() {
        if (!this.gridView) {
            throw new Error('Error: this.gridView is undefined');
        }
        return this.gridView;
    }
}
