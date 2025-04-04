import { Engine, NodeList, System, defineNode } from "@ash.ts/ash";
import { Container, Rectangle } from "pixi.js";
import { EntityCreator } from "../EntityCreator";
import { Display } from "../display/components/Display";
import { Interactive } from "./components/Interactive";
import { Tile } from "./components/Tile";
import { TileSelectedNode } from "./nodes/TileSelectedNode";

export class TileInteractiveNode extends defineNode({
    tile: Tile,
    display: Display,
    interactive: Interactive,
}) { }

export class TileInteractiveSystem extends System {

    private tiles?: NodeList<TileInteractiveNode>;
    private tilesSelected?: NodeList<TileSelectedNode>;

    constructor(
        private creator: EntityCreator
    ) {
        super()
    }

    addToEngine(engine: Engine): void {
        this.tiles = engine.getNodeList(TileInteractiveNode);

        for (let node = this.tiles.head; node; node = node.next) {
            this.handleTileAdded(node);
        }

        this.tiles.nodeAdded.add(this.handleTileAdded);
        this.tiles.nodeRemoved.add(this.handleTileRemoved);

        this.tilesSelected = engine.getNodeList(TileSelectedNode);
    }

    removeFromEngine(_engine: Engine): void {
        this.tiles.nodeAdded.remove(this.handleTileAdded);
        this.tiles.nodeRemoved.remove(this.handleTileRemoved);

        for (let node = this.tiles.head; node; node = node.next) {
            this.handleTileRemoved(node);
        }

        this.tiles = undefined;


        this.tilesSelected = undefined;
    }

    update(_time: number): void {
    }

    private handleTileAdded = (node: TileInteractiveNode) => {
        const width = (node.display.view as Container).width;
        const height = (node.display.view as Container).height;
        node.display.view.hitArea = new Rectangle(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
        node.display.view.interactive = true;
        node.display.view.cursor = 'pointer';
        node.display.view.on('pointerdown', this.handleClick);
    }

    private handleTileRemoved = (node: TileInteractiveNode) => {
        node.display.view.interactive = false;
        node.display.view.cursor = 'auto';
        node.display.view.off('pointerdown', this.handleClick);
    }

    private handleClick = (e: any) => {
        for (let node = this.tiles?.head; node; node = node.next) {
            if (node.display.view === e.target) {
                this.clickTile(node);
            }
        }
    }

    private clickTile(node: TileInteractiveNode) {
        for (let selected = this.tilesSelected?.head; selected; selected = selected.next) {
            if (selected.tile.id === node.tile.id) {
                this.creator.selectTile(node.tile, false);
                return;
            }
        }

        this.creator.selectTile(node.tile, true);
    }
}