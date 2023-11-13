import { rotate270 } from "2d-array-rotation";
import { Engine, NodeList } from "@ash.ts/ash";
import { Config } from "../Config";
import { LAYERS } from "../GameLayers";
import { stageService } from "../core/services/StageService";
import { EntityCreator } from "../ecs/EntityCreator";
import { AnimationSystem } from "../ecs/animation/AnimationSystem";
import { DisplaySystem } from "../ecs/display/DisplaySystem";
import { GridViewSystem } from "../ecs/game/GridViewSystem";
import { TileToggleSystem } from "../ecs/tiles/TileToggleSystem";
import { TilesGridSystem } from "../ecs/tiles/TilesGridSystem";
import { TileNode } from "../ecs/tiles/nodes/TileNode";
import { throwIfNull } from "../utils/throwIfNull";
import { GridView } from "../view/GridView";
import { BaseController } from "./BaseController";
import { SystemPriorities } from "./GameController";
import { dataService } from "../core/services/DataService";
import { GameModel } from "../model/GameModel";
import { PointLike } from "../utils/point";
import { PathAnimatedLikeSnakeView } from "../view/PathAnimatedLikeSnakeView";
import { GameLogic } from "../ecs/game/GameLogic";
import { TileHelpEffectNode } from "../ecs/tiles/nodes/TileHelpEffectNode";
import { TileShakingSystem } from "../ecs/tiles/TileShakingSystem";

class AnimationQueueItem {
    constructor(
        public method: () => void,
        public timeout: number,
    ) { }
}

export class TutorialController extends BaseController {

    private creator?: EntityCreator;
    private engine?: Engine;
    private gameLogic?: GameLogic;
    private gridView?: GridView;
    private tiles?: NodeList<TileNode>;
    private helpEffectNodes?: NodeList<TileHelpEffectNode>;

    private portrait: number[][];
    private landscape: number[][];

    private currentCircle = Number.MAX_SAFE_INTEGER;
    private icons = [0, 1, 2, 3, 4];

    private animationQueue: AnimationQueueItem[] = [];
    private animationQueueTimeout = 0;

    protected async doExecute() {
        this.setupView();
        this.setupEngine();
        this.generateGrid();
        this.nextCircle();
    }

    private setupView() {
        this.gridView = new GridView();
        stageService.getLayer(LAYERS.TUTORIAL).addChild(this.gridView);
    }

    private async setupEngine() {
        this.engine = new Engine();
        this.gameLogic = new GameLogic(this.engine);
        this.creator = new EntityCreator(this.engine, throwIfNull(this.gridView));

        this.tiles = this.engine.getNodeList(TileNode);
        this.helpEffectNodes = this.engine.getNodeList(TileHelpEffectNode);

        this.engine.addSystem(new GridViewSystem(this.getGridView()), SystemPriorities.update);
        this.engine.addSystem(new TilesGridSystem(), SystemPriorities.update);
        this.engine.addSystem(new AnimationSystem(), SystemPriorities.animate);
        this.engine.addSystem(new TileShakingSystem(this.creator), SystemPriorities.animate);
        this.engine.addSystem(new TileToggleSystem(this.creator), SystemPriorities.animate);
        this.engine.addSystem(new DisplaySystem(), SystemPriorities.render);

        stageService.updateSignal.add(this.update);
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
        this.creator.createTile(this.icons[4], deltaCol + 1, deltaRow);
        grid[deltaRow][deltaCol + 1] = throwIfNull(this.tiles?.tail).tile.id;
        this.creator.createTile(this.icons[0], deltaCol + 2, deltaRow);
        grid[deltaRow][deltaCol + 2] = throwIfNull(this.tiles?.tail).tile.id;

        this.creator.createTile(this.icons[1], deltaCol, deltaRow + 1);
        grid[deltaRow + 1][deltaCol] = throwIfNull(this.tiles?.tail).tile.id;
        this.creator.createTile(this.icons[1], deltaCol + 1, deltaRow + 1);
        grid[deltaRow + 1][deltaCol + 1] = throwIfNull(this.tiles?.tail).tile.id;
        this.creator.createTile(this.icons[3], deltaCol + 3, deltaRow + 1);
        grid[deltaRow + 1][deltaCol + 3] = throwIfNull(this.tiles?.tail).tile.id;

        this.creator.createTile(this.icons[2], deltaCol, deltaRow + 2);
        grid[deltaRow + 2][deltaCol] = throwIfNull(this.tiles?.tail).tile.id;
        this.creator.createTile(this.icons[3], deltaCol + 1, deltaRow + 2);
        grid[deltaRow + 2][deltaCol + 1] = throwIfNull(this.tiles?.tail).tile.id;
        this.creator.createTile(this.icons[4], deltaCol + 3, deltaRow + 2);
        grid[deltaRow + 2][deltaCol + 3] = throwIfNull(this.tiles?.tail).tile.id;

        this.creator.createTile(this.icons[2], deltaCol + 2, deltaRow + 3);
        grid[deltaRow + 3][deltaCol + 2] = throwIfNull(this.tiles?.tail).tile.id;


        // rotation
        const newGrid = rotate270(grid);
        this.portrait = grid.length > newGrid.length ? grid : newGrid;
        this.landscape = this.portrait === grid ? newGrid : grid;

        // create grid
        this.creator.createGrid(grid, this.portrait, this.landscape);
    }

    private async nextCircle() {
        const selectTiming = .2;
        const pathTiminig = .7;
        const pauseTiming = .5;
        const errorTiming = .5;
        const shakingTiming = .5;

        const order = [this.icons[1], this.icons[2], this.icons[0], this.icons[3], this.icons[4]];

        this.currentCircle++;
        this.currentCircle = this.currentCircle >= order.length ? 0 : this.currentCircle;

        const showRed = this.currentCircle === order.length - 1;

        const iconState = dataService.getRootModel<GameModel>().raw.icons[order[this.currentCircle]];
        const positions: PointLike[] = [];
        // show pair
        for (let node = this.tiles.head; node; node = node.next) {
            if (node.icon.state.key === iconState.key) {
                positions.push({ x: node.gridPosition.x, y: node.gridPosition.y });

                if (showRed && positions.length > 1) {
                    this.animationQueue.push(new AnimationQueueItem(
                        () => { this.creator.createTileHelpEffect(node.transform.position.x, node.transform.position.y); },
                        errorTiming
                    ));
                    this.animationQueue.push(new AnimationQueueItem(
                        () => { this.creator.shakeTile(node.tile, true) },
                        shakingTiming
                    ));
                } else {
                    this.animationQueue.push(new AnimationQueueItem(
                        () => { this.creator.selectTile(node.tile, true) },
                        selectTiming
                    ));
                }
            }
        }

        // show path
        const path = await this.gameLogic.findCross(positions[0], positions[1]);
        if (path.length) {
            this.animationQueue.push(new AnimationQueueItem(
                () => {
                    this.creator.showPath(path, Config.PATH_LIKE_SNAKE_DURATION * 3);
                },
                pathTiminig
            ));
        }

        // hide path
        this.animationQueue.push(new AnimationQueueItem(
            () => {
                const entities = this.creator.getEngine().entities;
                for (let i = 0; i < entities.length; i++) {
                    if (entities[i].get(PathAnimatedLikeSnakeView)) {
                        this.creator.removeEntity(entities[i]);
                        break;
                    }
                }
            },
            0
        ));

        // pause
        this.animationQueue.push(new AnimationQueueItem(
            () => { },
            pauseTiming
        ))

        // clear pair
        this.animationQueue.push(new AnimationQueueItem(
            () => {
                for (let node = this.tiles.head; node; node = node.next) {
                    this.creator.selectTile(node.tile, false);
                }
                if (showRed) {
                    while (this.helpEffectNodes?.head) {
                        this.creator.removeEntity(this.helpEffectNodes.head.entity);
                    }
                }
            },
            0
        ));

        // next circle
        this.animationQueue.push(new AnimationQueueItem(
            () => { this.nextCircle(); },
            pauseTiming
        ))
    }

    update = (time: number) => {
        this.engine?.update(time);

        if (!this.animationQueue.length) {
            return;
        }

        this.animationQueueTimeout -= time;
        if (this.animationQueueTimeout > 0) {
            return;
        }

        const item = this.animationQueue.shift();
        if (!item) {
            return;
        }

        this.animationQueueTimeout = item.timeout;
        item.method();
    };
}