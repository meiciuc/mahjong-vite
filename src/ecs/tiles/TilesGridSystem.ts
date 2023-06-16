import { Engine, NodeList, System } from "@ash.ts/ash";
import { Config } from "../../Config";
import { GridNode } from "./nodes/GridNode";
import { TileNode } from "./nodes/TileNode";

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

        for (let i = 0; i < this.grid.head.grid.grid.length; i++) {
            let br = false;
            for (let j = 0; j < this.grid.head.grid.grid[i].length; j++) {
                if (this.grid.head.grid.grid[i][j] === node.tile.id) {
                    this.grid.head.grid.grid[i][j] = Config.GRID_EMPTY_VALUE;
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