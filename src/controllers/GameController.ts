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
import { AppStateEnum, GameModel, GameStateEnum } from '../model/GameModel';
import { GameModelHelper } from '../model/GameModelHelper';
import { throwIfNull } from '../utils/throwIfNull';
import { GridView } from '../view/GridView';
import { BaseController } from './BaseController';
import { FadeOutSystem } from '../ecs/fade/FadeOutSystem';
import { FadeInSystem } from '../ecs/fade/FadeInSystem';
import { AgeSystem } from '../ecs/age/AgeSystem';
import { GarbageCollectorSystem } from '../ecs/garbageCollector/GarbageCollectorSystem';

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
    protected creator?: EntityCreator;
    protected fsm?: EngineStateMachine;
    protected engine?: Engine;
    protected gridView?: GridView;
    protected gameLogic?: GameLogic;

    destroy(): void {
        dataService.getRootModel<GameModel>().unsubscribe(['appState'], this.handleAppStateChange);
        stageService.updateSignal.remove(this.update);
        this.engine?.removeAllEntities();
        this.engine?.removeAllSystems();
        this.engine = undefined;
        this.gridView?.destroy();
        this.gridView = undefined;
    }

    protected async doExecute() {
        this.setupView();
        this.setupEngine();
    }

    protected complete(): void {
        super.complete();
    }

    protected setupView() {
        this.gridView = new GridView();
        stageService.getLayer(LAYERS.GAME).addChild(this.gridView);
    }

    protected setupGameLogic() {
        this.gameLogic = new GameLogic(this.engine);
        this.gameLogic.generateIconsQueue();
    }

    protected async setupEngine() {
        this.engine = new Engine();

        this.setupGameLogic();

        this.creator = new EntityCreator(this.engine, throwIfNull(this.gridView));
        this.creator.createGame();

        const timer = new GameTimerSystem();
        timer.priority = SystemPriorities.update;

        const help = new HelpSystem(this.creator, this.gameLogic);
        help.priority = SystemPriorities.update;

        const interactive = new TileInteractiveSystem(this.creator);
        interactive.priority = SystemPriorities.move;

        const fadeIn = new FadeInSystem();
        const fadeOut = new FadeOutSystem();

        this.fsm = new EngineStateMachine(this.engine);
        this.fsm.createState(GameControllerStateEnum.GAME)
            .addInstance(timer)
            .addInstance(help)
            .addInstance(interactive)
            .addInstance(fadeIn);
        this.fsm.createState(GameControllerStateEnum.PAUSE)
            .addInstance(fadeOut);

        this.engine.addSystem(new GameSystem(this.creator, this.gameLogic), SystemPriorities.preUpdate);
        this.engine.addSystem(new AgeSystem(this.creator), SystemPriorities.preUpdate);
        this.engine.addSystem(new GridViewSystem(this.getGridView()), SystemPriorities.update);
        this.engine.addSystem(new TilesGridSystem(), SystemPriorities.update);
        this.engine.addSystem(new AnimationSystem(), SystemPriorities.animate);
        this.engine.addSystem(new TileShakingSystem(this.creator), SystemPriorities.animate);
        this.engine.addSystem(new TileToggleSystem(this.creator), SystemPriorities.animate);
        this.engine.addSystem(new DisplaySystem(), SystemPriorities.render);
        this.engine.addSystem(new GarbageCollectorSystem(), SystemPriorities.preUpdate)

        this.fsm.changeState(GameControllerStateEnum.GAME);

        stageService.updateSignal.add(this.update);
        GameModelHelper.setGameState(GameStateEnum.NONE);

        dataService.getRootModel<GameModel>().subscribe(['appState'], this.handleAppStateChange);
    }

    update = (time: number) => {
        this.engine?.update(time);

        if (this.gameIsOver()) {
            this.complete();
        }
    };

    protected getGridView() {
        if (!this.gridView) {
            throw new Error('Error: this.gridView is undefined');
        }
        return this.gridView;
    }

    protected gameIsOver() {
        const state = this.engine?.getNodeList(GameNode).head?.game.model.data.gameState;
        return state === GameStateEnum.GAME_DEFEATE || state === GameStateEnum.GAME_VICTORY || state === GameStateEnum.GAME_NO_MORE_MOVES;
    }

    protected handleAppStateChange = (state: AppStateEnum) => {
        if (state === AppStateEnum.GAME_SCREEN) {
            this.fsm.changeState(GameControllerStateEnum.GAME);
        } else {
            this.fsm.changeState(GameControllerStateEnum.PAUSE);
        }
    }
}
