import { Engine, EngineStateMachine } from '@ash.ts/ash';
import { LAYERS } from '../GameLayers';
import { dataService } from '../core/services/DataService';
import { stageService } from '../core/services/StageService';
import { EntityCreator } from '../ecs/EntityCreator';
import { AnimationSystem } from '../ecs/animation/AnimationSystem';
import { DisplaySystem } from '../ecs/display/DisplaySystem';
import { GameLogic } from '../ecs/game/GameLogic';
import { GameSystem } from '../ecs/game/GameSystem';
import { GridViewSystem } from '../ecs/game/GridViewSystem';
import { HelpSystem } from '../ecs/game/HelpSystem';
import { GameNode } from '../ecs/game/nodes/GameNode';
import { TileInteractiveSystem } from '../ecs/tiles/TileInteractiveSystem';
import { TileShakingSystem } from '../ecs/tiles/TileShakingSystem';
import { TileToggleSystem } from '../ecs/tiles/TileToggleSystem';
import { TilesGridSystem } from '../ecs/tiles/TilesGridSystem';
import { GameTimerSystem } from '../ecs/timer/GameTimerSystem';
import { GameModel, GameStateEnum } from '../model/GameModel';
import { GameModelHelper } from '../model/GameModelHelper';
import { throwIfNull } from '../utils/throwIfNull';
import { GridView } from '../view/GridView';
import { vueService } from '../vue/VueService';
import { BaseController } from './BaseController';

export enum SystemPriorities {
    preUpdate = 1,
    update = 2,
    move = 3,
    resolveCollisions = 4,
    animate = 5,
    render = 6,
    audio = 7,
}

enum GameControllerStateEnum {
    GAME = 'game',
    PAUSE = 'pause',
}

export class GameController extends BaseController {
    private creator?: EntityCreator;
    private fsm?: EngineStateMachine;
    private engine?: Engine;
    private gridView?: GridView;
    private gameLogic?: GameLogic;

    destroy(): void {
        vueService.signalPauseButton.off(this.handlePauseButton);
        stageService.updateSignal.remove(this.update);
        this.engine?.removeAllSystems();
        this.gridView?.destroy();
    }

    pause(value: boolean) {
        const model = dataService.getRootModel<GameModel>();
        model.data.pause = value;
        this.fsm.changeState(value ? GameControllerStateEnum.PAUSE : GameControllerStateEnum.GAME);
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

        this.creator.createGame();

        const keys: string[] = [];
        const icons = dataService.getRootModel<GameModel>().data.icons;
        icons.forEach((icon) => {
            keys.push(icon.key);
        });

        const timer = new GameTimerSystem();
        timer.priority = SystemPriorities.update;

        const help = new HelpSystem(this.creator, this.gameLogic);
        help.priority = SystemPriorities.update;

        const interactive = new TileInteractiveSystem(this.creator);
        interactive.priority = SystemPriorities.move;

        this.fsm = new EngineStateMachine(this.engine);
        this.fsm.createState(GameControllerStateEnum.GAME)
            .addInstance(timer)
            .addInstance(help)
            .addInstance(interactive)
        this.fsm.createState(GameControllerStateEnum.PAUSE);

        this.engine.addSystem(new GameSystem(this.creator, this.gameLogic), SystemPriorities.preUpdate);
        this.engine.addSystem(new GridViewSystem(this.getGridView()), SystemPriorities.update);
        this.engine.addSystem(new TilesGridSystem(), SystemPriorities.update);
        this.engine.addSystem(new AnimationSystem(), SystemPriorities.animate);
        this.engine.addSystem(new TileShakingSystem(this.creator), SystemPriorities.animate);
        this.engine.addSystem(new TileToggleSystem(this.creator), SystemPriorities.animate);
        this.engine.addSystem(new DisplaySystem(), SystemPriorities.render);

        this.fsm.changeState(GameControllerStateEnum.GAME);

        stageService.updateSignal.add(this.update);
        GameModelHelper.setGameState(GameStateEnum.NONE);

        vueService.signalPauseButton.on(this.handlePauseButton);
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

    private handlePauseButton = () => {
        const model = dataService.getRootModel<GameModel>();
        this.pause(!model.raw.pause);
    }
}
