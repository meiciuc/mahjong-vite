import { rotate270 } from "2d-array-rotation";
import { Engine, EngineStateMachine, Entity, NodeList } from "@ash.ts/ash";
import { Point, Sprite } from "pixi.js";
import { Config } from "../Config";
import { LAYERS } from "../GameLayers";
import { SOUNDS } from "../Sounds";
import { dataService } from "../core/services/DataService";
import { stageService } from "../core/services/StageService";
import { EntityCreator } from "../ecs/EntityCreator";
import { AnimationSystem } from "../ecs/animation/AnimationSystem";
import { DisplaySystem } from "../ecs/display/DisplaySystem";
import { FadeInSystem } from "../ecs/fade/FadeInSystem";
import { FadeOutSystem } from "../ecs/fade/FadeOutSystem";
import { GameLogic } from "../ecs/game/GameLogic";
import { GridViewSystem } from "../ecs/game/GridViewSystem";
import { GarbageCollectorSystem } from "../ecs/garbageCollector/GarbageCollectorSystem";
import { TileInteractiveSystem } from "../ecs/tiles/TileInteractiveSystem";
import { TileShakingSystem } from "../ecs/tiles/TileShakingSystem";
import { TileToggleSystem } from "../ecs/tiles/TileToggleSystem";
import { TilesGridSystem } from "../ecs/tiles/TilesGridSystem";
import { Interactive } from "../ecs/tiles/components/Interactive";
import { TileHelpEffectNode } from "../ecs/tiles/nodes/TileHelpEffectNode";
import { TileNode } from "../ecs/tiles/nodes/TileNode";
import { TileSelectedNode } from "../ecs/tiles/nodes/TileSelectedNode";
import { AppStateEnum, GameModel, GameStateEnum } from "../model/GameModel";
import { GameModelHelper } from "../model/GameModelHelper";
import { soundService } from "../services/SoundService";
import { TimeSkipper } from "../utils/TimeSkipper";
import { PointLike } from "../utils/point";
import { throwIfNull } from "../utils/throwIfNull";
import { GridView } from "../view/GridView";
import { VueServiceSignals, vueService } from "../vue/VueService";
import { BaseController } from "./BaseController";
import { SystemPriorities } from "./GameController";
import { Pointer } from "./tutorial/Pointer";

enum GameControllerStateEnum {
    GAME = 'game',
    PAUSE = 'pause',
}

export class TutorialController extends BaseController {

    private creator?: EntityCreator;
    private fsm?: EngineStateMachine;
    private engine?: Engine;
    private gameLogic?: GameLogic;
    private gridView?: GridView;
    private tiles?: NodeList<TileNode>;

    private portrait: number[][];
    private landscape: number[][];

    private icons = [0, 1, 2, 3, 4];

    private grid: number[][];

    private pointer: Pointer;
    private leaveTutoralButton = document.createElement('button');
    private menuTimer: HTMLDivElement;
    private menuHelp: HTMLDivElement;

    destroy(): void {
        this.tiles?.nodeAdded.removeAll();
        this.tiles?.nodeRemoved.removeAll();
        GameModelHelper.getModel().data.tutorialOnly = false;
        dataService.getRootModel<GameModel>().unsubscribe(['appState'], this.handleAppStateChange);
        this.pointer?.destroy();
        this.leaveTutoralButton.remove();
    }

    protected async doExecute() {
        GameModelHelper.getModel().data.tutorialOnly = true;
        this.setupView();
        this.setupEngine();
        this.generateGrid();
        this.setupGameMenu();
        this.setupPointer();
        this.setupLeaveTutorialButton();
        await this.nextCircle();

        this.complete();
    }

    protected complete() {
        console.log('COMPLETE')
        this.destroy();
        super.complete();
    }

    private setupGameMenu() {
        const menuTimer = document.body.getElementsByClassName('MenuPanel__GameMenuTimer');
        const menuHelp = document.body.getElementsByClassName('MenuPanel__GameMenuHelp');
        if (!menuTimer.length || !menuHelp.length) {
            return;
        }

        this.menuTimer = menuTimer[0] as HTMLDivElement;
        this.menuTimer.style.pointerEvents = 'none';

        this.menuHelp = menuHelp[0] as HTMLDivElement;
        this.menuHelp.style.pointerEvents = 'none';

        dataService.getRootModel<GameModel>().data.gameAge = 21;

    }

    private setupLeaveTutorialButton() {
        // TODO icon
        this.leaveTutoralButton.innerText = 'LEAVE';
        this.leaveTutoralButton.style.position = 'absolute';
        this.leaveTutoralButton.style.right = '1em';
        this.leaveTutoralButton.style.bottom = '1em';
        this.leaveTutoralButton.style.cursor = 'pointer';

        document.body.appendChild(this.leaveTutoralButton);

        this.leaveTutoralButton.onclick = () => this.complete();
        this.leaveTutoralButton.ontouchstart = () => this.complete();
    }

    private setupPointer() {
        this.pointer = new Pointer();
    }

    private showTutorialUI(value: boolean) {
        this.pointer.visible = value;
        this.leaveTutoralButton.style.opacity = `${value ? '1' : '0'}`;
        this.leaveTutoralButton.style.pointerEvents = `${value ? 'auto' : 'none'}`;
    }

    private async waitClickTimer() {
        if (!this.menuTimer) {
            return;
        }

        const bounding = this.menuTimer.getBoundingClientRect();
        this.pointer?.movePointer(new Point(bounding.x, bounding.y), new Point(bounding.right, bounding.bottom), 300);

        this.menuTimer.style.pointerEvents = 'auto';

        await this.waitMenuClick(VueServiceSignals.BoosterTimeClick);

        this.menuTimer.style.pointerEvents = 'none';
    }

    private async waitClickHelper() {
        if (!this.menuHelp) {
            return;
        }

        const bounding = this.menuHelp.getBoundingClientRect();
        this.pointer?.movePointer(new Point(bounding.x, bounding.y), new Point(bounding.right, bounding.bottom), 300);

        this.menuHelp.style.pointerEvents = 'auto';

        await this.waitMenuClick(VueServiceSignals.BoosterHelpClick);

        this.menuHelp.style.pointerEvents = 'none';
    }

    private movePointerToTile(node: TileNode, duration = 0) {
        const view = node.display.view;
        const { x, y, width, height } = view as Sprite;
        if (view && x && y && width && height) {

            const tl = view.toGlobal(new Point(0, 0));
            const br = view.toGlobal(new Point(width, height));

            const bounding = stageService.stage.view.getBoundingClientRect();
            tl.y += bounding.y;
            br.y += bounding.y;

            this.pointer?.movePointer(tl, br, duration);
        }
    }

    private setupView() {
        this.gridView = new GridView();
        stageService.getLayer(LAYERS.GAME).addChild(this.gridView);
    }

    private async setupEngine() {
        this.engine = new Engine();
        this.gameLogic = new GameLogic(this.engine);
        this.creator = new EntityCreator(this.engine, throwIfNull(this.gridView));

        this.tiles = this.engine.getNodeList(TileNode);

        const fadeIn = new FadeInSystem();
        const fadeOut = new FadeOutSystem();

        this.fsm = new EngineStateMachine(this.engine);
        this.fsm.createState(GameControllerStateEnum.GAME)
            .addMethod(() => {
                this.showTutorialUI(true);
                return fadeIn;
            });

        this.fsm.createState(GameControllerStateEnum.PAUSE)
            .addMethod(() => {
                this.showTutorialUI(false);
                return fadeOut;
            });

        this.engine.addSystem(new GridViewSystem(this.getGridView()), SystemPriorities.update);
        this.engine.addSystem(new TilesGridSystem(), SystemPriorities.update);
        this.engine.addSystem(new AnimationSystem(), SystemPriorities.animate);
        this.engine.addSystem(new TileShakingSystem(this.creator), SystemPriorities.animate);
        this.engine.addSystem(new TileToggleSystem(this.creator), SystemPriorities.animate);
        this.engine.addSystem(new DisplaySystem(), SystemPriorities.render);
        this.engine.addSystem(new GarbageCollectorSystem(), SystemPriorities.preUpdate);

        stageService.updateSignal.add(this.update);

        this.fsm.changeState(GameControllerStateEnum.GAME);

        dataService.getRootModel<GameModel>().subscribe(['appState'], this.handleAppStateChange);
    }

    private getGridView() {
        if (!this.gridView) {
            throw new Error('Error: this.gridView is undefined');
        }
        return this.gridView;
    }

    private generateGrid() {
        const cols = 10;
        const rows = 10;
        const deltaCol = 3;
        const deltaRow = 3;
        const grid: number[][] = [];
        for (let i = 0; i < rows; i++) {
            grid.push(new Array(cols).fill(Config.GRID_EMPTY_VALUE))
        }
        this.creator.createGrid(grid, this.portrait, this.landscape);


        this.creator.createTile(this.icons[0], deltaCol, deltaRow);
        grid[deltaRow][deltaCol] = throwIfNull(this.tiles?.tail).tile.id;
        this.creator.createTile(this.icons[0], deltaCol + 2, deltaRow);
        grid[deltaRow][deltaCol + 2] = throwIfNull(this.tiles?.tail).tile.id;

        this.creator.createTile(this.icons[1], deltaCol, deltaRow + 1);
        grid[deltaRow + 1][deltaCol] = throwIfNull(this.tiles?.tail).tile.id;
        this.creator.createTile(this.icons[1], deltaCol + 1, deltaRow + 1);
        grid[deltaRow + 1][deltaCol + 1] = throwIfNull(this.tiles?.tail).tile.id;

        this.creator.createTile(this.icons[3], deltaCol + 3, deltaRow + 1);
        grid[deltaRow + 1][deltaCol + 3] = throwIfNull(this.tiles?.tail).tile.id;
        this.creator.createTile(this.icons[3], deltaCol + 1, deltaRow + 2);
        grid[deltaRow + 2][deltaCol + 1] = throwIfNull(this.tiles?.tail).tile.id;

        this.creator.createTile(this.icons[2], deltaCol, deltaRow + 2);
        grid[deltaRow + 2][deltaCol] = throwIfNull(this.tiles?.tail).tile.id;
        this.creator.createTile(this.icons[2], deltaCol + 2, deltaRow + 3);
        grid[deltaRow + 3][deltaCol + 2] = throwIfNull(this.tiles?.tail).tile.id;

        this.creator.createTile(this.icons[4], deltaCol + 1, deltaRow);
        grid[deltaRow][deltaCol + 1] = throwIfNull(this.tiles?.tail).tile.id;
        this.creator.createTile(this.icons[4], deltaCol + 3, deltaRow + 2);
        grid[deltaRow + 2][deltaCol + 3] = throwIfNull(this.tiles?.tail).tile.id;

        // rotation
        const newGrid = rotate270(grid);
        this.portrait = grid.length > newGrid.length ? grid : newGrid;
        this.landscape = this.portrait === grid ? newGrid : grid;

        // create grid
        this.grid = grid;
        this.creator.createGrid(grid, this.portrait, this.landscape);
    }

    private async nextCircle() {
        this.engine.addSystem(new TileInteractiveSystem(this.creator), SystemPriorities.move);

        for (let node = this.tiles.head; node; node = node.next) {
            node.entity.remove(Interactive);
        }

        const selectedPoints: PointLike[] = [];
        const selectedEntities: Entity[] = [];

        const nodes: TileNode[] = [];
        for (let node = this.tiles.head; node; node = node.next) {
            nodes.push(node);
        }

        let steps = 0;

        for (const node of nodes) {
            steps++;
            node.entity.add(new Interactive());

            this.movePointerToTile(node, selectedEntities.length ? 300 : 0);

            await this.waitTileClick();
            node.entity.remove(Interactive);

            selectedPoints.push(node.gridPosition);
            selectedEntities.push(node.entity);

            if (selectedPoints.length === 2) {
                soundService.play(SOUNDS.bookClose);

                const selectedPath = await GameLogic.findCross(this.grid, selectedPoints[0], selectedPoints[1]);

                const pathDuration = Config.PATH_LIKE_SNAKE_DURATION;

                const pathEntity = this.creator.showPath(selectedPath, pathDuration);

                const effectDelay = pathDuration * 1500;
                await new TimeSkipper(effectDelay).execute();

                selectedEntities.forEach((entity) => {
                    this.creator.removeEntity(entity);
                });

                if (pathEntity) {
                    this.creator.removeEntity(pathEntity);
                }

                selectedEntities.splice(0);
                selectedPoints.splice(0);
            }

            if (steps === 8) {
                break;
            }
        }

        // show timer
        await this.waitClickTimer();

        // show helper
        await this.waitClickHelper();

        // unlock all tiles
        for (let node = this.tiles.head; node; node = node.next) {
            node.entity.add(new Interactive());
            this.creator.createTileHelpEffect(node.transform.position.x, node.transform.position.y);
        }

        await this.waitTileClick();

        // remove help effects
        const helpEffectNodes = this.creator.getEngine().getNodeList(TileHelpEffectNode);
        console.log('helpEffectNodes', helpEffectNodes)
        for (let node = helpEffectNodes.head; node; node = node.next) {
            console.log('remove effect')
            this.creator.removeEntity(node.entity);
        }

        // wait victory
        return new Promise(res => {
            this.tiles.nodeRemoved.add(() => {
                if (!this.tiles.head) {
                    console.log('TUTORIAL VICTORY')
                    res(true);
                }
            })
        });
    }

    update = (time: number) => {
        this.engine?.update(time);

        if (dataService.getRootModel<GameModel>().data.gameAge > 4) {
            dataService.getRootModel<GameModel>().data.gameAge -= time;
        }
    };

    private async waitTileClick() {
        GameModelHelper.setGameState(GameStateEnum.CLICK_WAIT);
        return new Promise(async resolve => {
            const selected = this.creator.getEngine().getNodeList(TileSelectedNode);

            const executed = (node: TileSelectedNode) => {
                selected.nodeAdded.remove(executed);
                this.creator?.selectTile(node.tile, true);
                resolve(true);
            }

            selected.nodeAdded.add(executed);
        });
    }

    private async waitMenuClick(value: VueServiceSignals) {
        return new Promise(res => {
            const handler = (signal: VueServiceSignals) => {
                if (signal === value) {
                    vueService.signalDataBus.off(handler);
                    res(true);
                }
            }

            vueService.signalDataBus.on(handler)
        });
    }

    getEdgesLength(arr: PointLike[]) {
        let corners = 1
        if (arr.length < 3) {
            return corners;
        }

        let xDirection = Math.round(arr[1].x - arr[0].x);
        let yDirection = Math.round(arr[1].y - arr[0].y);
        for (let i = 2; i < arr.length; i++) {
            const xDirection1 = Math.round(arr[i].x - arr[i - 1].x);
            const yDirection1 = Math.round(arr[i].y - arr[i - 1].y);
            if (xDirection !== xDirection1 || yDirection !== yDirection1) {
                corners++;
            }
            xDirection = xDirection1;
            yDirection = yDirection1;
        }
        return Math.min(corners, 3);
    }

    private handleAppStateChange = (state: AppStateEnum) => {
        if (state === AppStateEnum.GAME_SCREEN) {
            this.fsm.changeState(GameControllerStateEnum.GAME);
        } else {
            this.fsm.changeState(GameControllerStateEnum.PAUSE);
        }
    }
}