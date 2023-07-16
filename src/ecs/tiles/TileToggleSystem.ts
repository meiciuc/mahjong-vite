import { Engine, NodeList, System, defineNode } from "@ash.ts/ash";
import { TileSelectedNode } from "./nodes/TileSelectedNode";
import { EntityCreator } from "../EntityCreator";
import { TileToggleEffectNode } from "./nodes/TileToggleEffectNode";
import { Destroing } from "./components/Destroing";
import { Tile } from "./components/Tile";
import { Transform } from "../display/components/Transform";

export class TileDestroingNode extends defineNode({
    tile: Tile,
    destoing: Destroing,
    transform: Transform,
}) {}

export class TileToggleSystem extends System {

    private selected?: NodeList<TileSelectedNode>;
    private destroing?: NodeList<TileDestroingNode>;
    private effects?: NodeList<TileToggleEffectNode>;

    constructor(private creator: EntityCreator) {
        super();
    }

    addToEngine(engine: Engine): void {
        this.selected = engine.getNodeList(TileSelectedNode);
        this.selected.nodeAdded.add(this.handleSelectedAdded);
        this.selected.nodeRemoved.add(this.handleSelectedRemoved);

        this.destroing = engine.getNodeList(TileDestroingNode);
        this.destroing.nodeAdded.add(this.handleDestroingAdded);
        this.destroing.nodeRemoved.add(this.handleDestroingRemoved);

        this.effects = engine.getNodeList(TileToggleEffectNode);
    }

    removeFromEngine(_engine: Engine): void {
        this.selected.nodeAdded.remove(this.handleSelectedAdded);
        this.selected.nodeRemoved.remove(this.handleSelectedRemoved);
        this.selected = undefined;

        this.destroing.nodeAdded.remove(this.handleDestroingAdded);
        this.destroing.nodeRemoved.remove(this.handleDestroingRemoved);
        this.destroing = undefined;

        this.effects = undefined;
    }

    update(_time: number): void {
    }

    private handleSelectedAdded = (node: TileSelectedNode) => {
        this.creator.createTileToggleEffect(node.tile.id);
    }

    private handleSelectedRemoved = (node: TileSelectedNode) => {
        for (let effect = this.effects?.head; effect; effect = effect.next) {
            if (effect.effect.id === node.tile.id) {
                this.creator.removeEntity(effect.entity);
            }
        }
    }

    private handleDestroingAdded = (node: TileDestroingNode) => {
        this.creator.createTileToggleEffect(node.tile.id);
    }

    private handleDestroingRemoved = (node: TileDestroingNode) => {
        for (let effect = this.effects?.head; effect; effect = effect.next) {
            if (effect.effect.id === node.tile.id) {
                this.creator.removeEntity(effect.entity);
            }
        }
    }
    
}