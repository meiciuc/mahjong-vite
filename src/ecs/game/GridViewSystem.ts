import { Engine, NodeList, System } from '@ash.ts/ash';
import { Sprite, Texture } from 'pixi.js';
import { Config } from '../../Config';
import { GridView } from '../../view/GridView';
import { TileNode } from '../tiles/nodes/TileNode';
import { dataService } from '../../core/services/DataService';
import { GameModel } from '../../model/GameModel';

export class GridViewSystem extends System {
    private tiles?: NodeList<TileNode>;

    constructor(public gridView: GridView) {
        super();
    }

    addToEngine(engine: Engine): void {
        this.tiles = engine.getNodeList(TileNode);
        this.tiles.nodeAdded.add(this.handleTileAdded);

        this.setupView();
        this.scaleUpdate();
    }

    removeFromEngine(_engine: Engine): void {
        this.tiles?.nodeAdded.remove(this.handleTileAdded);
        this.tiles = undefined;
    }

    update(_time: number): void {
        this.scaleUpdate();
    }

    private handleTileAdded = (node: TileNode) => {
        node.transform.position.x = node.gridPosition.x * Config.ICON_IMAGE_WIDTH;
        node.transform.position.y = node.gridPosition.y * Config.ICON_IMAGE_HEIGHT;
    };

    private setupView() {
        const w = (dataService.getRootModel<GameModel>().data.gridWidth + 2) * Config.ICON_IMAGE_WIDTH;
        const h = (dataService.getRootModel<GameModel>().data.gridHeight + 2) * Config.ICON_IMAGE_HEIGHT;

        const bg = new Sprite(Texture.WHITE);
        bg.tint = Config.GRID_BaCKGROUND_COLOR;
        bg.width = w;
        bg.height = h;
        this.gridView.background.addChild(bg);
    }

    private scaleUpdate() {
        const w = (dataService.getRootModel<GameModel>().data.gridWidth + 2) * Config.ICON_IMAGE_WIDTH;
        const h = (dataService.getRootModel<GameModel>().data.gridHeight + 2) * Config.ICON_IMAGE_HEIGHT;

        const scale = Math.min(Config.GAME_WIDTH / w, Config.GAME_HEIGHT / h);

        this.gridView.grid.scale.set(scale);
        this.gridView.grid.position.set((Config.GAME_WIDTH - w * scale) / 2, (Config.GAME_HEIGHT - h * scale) / 2 + Config.ICON_IMAGE_HEIGHT / 2 * scale);
    }
}
