import { Engine, NodeList, System } from "@ash.ts/ash";
import { GameNode } from "../game/nodes/GameNode";
import { TileNode } from "./nodes/TileNode";
import { TileSelectedNode } from "./nodes/TileSelectedNode";
import { EntityCreator } from "../EntityCreator";
import { GameStateEnum } from "../../model/GameModel";
import { Config } from "../../Config";

export class TileInteractiveSystem extends System {

    private tiles?: NodeList<TileNode>;
    private tilesSelected?: NodeList<TileSelectedNode>;
    private game?: NodeList<GameNode>;

    private clickLastTime = 0;

    constructor(
        private creator: EntityCreator
    ) {
        super()
    }

    addToEngine(engine: Engine): void {
        this.tiles = engine.getNodeList(TileNode);
        this.tiles.nodeAdded.add(this.handleTileAdded);
        this.tiles.nodeRemoved.add(this.handleTileRemoved);

        this.tilesSelected = engine.getNodeList(TileSelectedNode);

        this.game = engine.getNodeList(GameNode);
    }

    removeFromEngine(_engine: Engine): void {
    }

    update(_time: number): void {
    }

    private handleTileAdded = (node: TileNode) => {
        node.display.view.interactive = true;
        node.display.view.cursor = 'pointer';
        node.display.view.on('mouseup', this.handleClick);
    }

    private handleTileRemoved = (node: TileNode) => {
        node.display.view.interactive = false;
        node.display.view.cursor = 'auto';
        node.display.view.off('mouseup', this.handleClick);
    }

    private handleClick = (e: any) => {
        if (!this.isHandable()) {
            return;
        }

        this.clickLastTime = Date.now();

        for (let node = this.tiles?.head; node; node = node.next) {
            if (node.display.view === e.target) {
                this.clickTile(node);
            }
        }
    }

    private clickTile(node: TileNode) {
        for (let selected = this.tilesSelected?.head; selected; selected = selected.next) {
            if (selected.tile.id === node.tile.id) {
                this.creator.selectTile(node.tile, false);
                return;
            }
        }

        this.creator.selectTile(node.tile, true);
    }

    private isHandable() {
        if (this.game?.head?.game.model.data.gameState !== GameStateEnum.CLICK_WAIT) {
            return false;
        }

        return Date.now() - this.clickLastTime > Config.CLICK_TIMEOUT;
    }
    
}