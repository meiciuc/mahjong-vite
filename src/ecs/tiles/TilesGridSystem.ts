import { Engine, NodeList, System, defineNode } from "@ash.ts/ash";
import { Config } from "../../Config";
import { GridNode } from "./nodes/GridNode";
import { Tile } from "./components/Tile";

export class TileNode extends defineNode({
    tile: Tile,
}) { }

export class TilesGridSystem extends System {
    private tiles?: NodeList<TileNode>;
    private grid?: NodeList<GridNode>;

    addToEngine(engine: Engine): void {
        this.tiles = engine.getNodeList(TileNode);
        this.tiles.nodeRemoved.add(this.handleTileRemoved);

        this.grid = engine.getNodeList(GridNode);
    }

    removeFromEngine(_engine: Engine): void {
        this.tiles?.nodeRemoved.remove(this.handleTileRemoved);
    }

    update(_time: number): void {

    }

    private handleTileRemoved = (node: TileNode) => {
        if (!this.grid?.head) {
            return;
        }

        this.removeTileFromGrid(node.tile.id, this.grid.head.grid.portrait);
        this.removeTileFromGrid(node.tile.id, this.grid.head.grid.landscape);
    }

    private removeTileFromGrid(id: number, grid: number[][]) {
        for (let i = 0; i < grid.length; i++) {
            let br = false;
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === id) {
                    grid[i][j] = Config.GRID_EMPTY_VALUE;
                    br = true;
                    break;
                }
            }
            if (br) {
                break;
            }
        }
    }

}