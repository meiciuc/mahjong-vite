import { Engine, NodeList, System } from '@ash.ts/ash';
import { Sprite, Texture } from 'pixi.js';
import { Config } from '../../Config';
import { GridView } from '../../view/GridView';
import { TileNode } from '../tiles/nodes/TileNode';
import { stageService } from '../../core/services/StageService';
import { GridNode } from '../tiles/nodes/GridNode';

export class GridViewSystem extends System {
    private tiles?: NodeList<TileNode>;
    private grid?: NodeList<GridNode>;
    private oResized = false;

    constructor(public gridView: GridView) {
        super();
    }

    addToEngine(engine: Engine): void {
        this.grid = engine.getNodeList(GridNode);
        if (this.grid.head) {
            this.setupView();
        }
        this.grid.nodeAdded.add(this.handleGridAdded);

        this.tiles = engine.getNodeList(TileNode);
        if (this.tiles.head) {
            for (let node = this.tiles.head; node; node = node.next) {
                this.handleTileAdded(node);
            }
        }
        this.tiles.nodeAdded.add(this.handleTileAdded);

        stageService.resizeSignal.add(this.handleStageServiceResize);
    }

    removeFromEngine(_engine: Engine): void {
        stageService.resizeSignal.remove(this.handleStageServiceResize);
        this.tiles?.nodeAdded.remove(this.handleTileAdded);
        this.tiles = undefined;
    }

    update(_time: number): void {
        if (this.oResized) {
            this.oResized = false;
            this.scaleUpdate();
        }
    }

    private handleGridAdded = () => {
        this.setupView();
        this.scaleUpdate();
    }

    private handleTileAdded = (node: TileNode) => {
        node.transform.position.x = node.gridPosition.x * Config.ICON_IMAGE_WIDTH;
        node.transform.position.y = node.gridPosition.y * Config.ICON_IMAGE_HEIGHT;
    };

    private handleStageServiceResize = () => {
        this.oResized = true;
    }

    private setupView() {
        const w = this.gridWidth * Config.ICON_IMAGE_WIDTH;
        const h = this.gridHeight * Config.ICON_IMAGE_HEIGHT;

        const bg = new Sprite(Texture.WHITE);
        bg.tint = Config.GRID_BaCKGROUND_COLOR;
        bg.width = w;
        bg.height = h;
        this.gridView.background.addChild(bg);
    }

    private scaleUpdate() {
        const gridWidth = this.gridWidth * Config.ICON_IMAGE_WIDTH;
        const gridHeight = this.gridHeight * Config.ICON_IMAGE_HEIGHT;

        const appWidth = stageService.width;
        const appHeight = stageService.height;

        const scale = Math.min(appWidth / gridWidth, appHeight / gridHeight);

        this.gridView.grid.scale.set(scale);
        const sizeX = gridWidth * scale;
        const sizeY = gridHeight * scale;
        this.gridView.grid.position.set((appWidth - sizeX) / 2, (appHeight - sizeY) / 2);
    }

    private get gridWidth() {
        return this.grid.head.grid.current[0].length;
    }

    private get gridHeight() {
        return this.grid.head.grid.current.length;
    }
}
