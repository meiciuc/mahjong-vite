import { Engine, NodeList, System } from '@ash.ts/ash';
import { Sprite } from 'pixi.js';
import { TileSelectedNode } from './nodes/TileSelectedNode';

export class TileImageSelectedEffectSystem extends System {
    private tiles?: NodeList<TileSelectedNode>;

    addToEngine(engine: Engine): void {
        this.tiles = engine.getNodeList(TileSelectedNode);
        this.tiles.nodeAdded.add(this.handleTileAdded);
        this.tiles.nodeRemoved.add(this.handleTileRemoved);
    }

    removeFromEngine(_engine: Engine): void {
        this.tiles?.nodeAdded.remove(this.handleTileAdded);
        this.tiles?.nodeRemoved.remove(this.handleTileRemoved);
    }

    update(_time: number): void {}

    private handleTileAdded = (node: TileSelectedNode) => {
        (node.display.view as Sprite).tint = 0xff0000;
    };

    private handleTileRemoved = (node: TileSelectedNode) => {
        (node.display.view as Sprite).tint = 0xffffff;
    };
}
