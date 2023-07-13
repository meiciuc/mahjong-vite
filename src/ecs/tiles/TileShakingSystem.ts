import { Engine, NodeList, System, defineNode } from "@ash.ts/ash";
import { TileAnimatedShakingView } from "../../view/TileAnimatedShakingView";
import { Transform } from "../display/components/Transform";
import { Tile } from "./components/Tile";
import { EntityCreator } from "../EntityCreator";

export class TileShakingNode extends defineNode({
    tile: Tile,
    transform: Transform,
    shaker: TileAnimatedShakingView,
}) {}

export class TileShakingSystem extends System {
    private nodes?: NodeList<TileShakingNode>;

    constructor(private creator: EntityCreator) {
        super();
    }

    addToEngine(engine: Engine): void {
        this.nodes = engine.getNodeList(TileShakingNode);
        this.nodes.nodeAdded.add(this.handleNodeAdded);
        this.nodes.nodeRemoved.add(this.handleNodeRemoved);
    }

    removeFromEngine(_engine: Engine): void {
        this.nodes.nodeAdded.remove(this.handleNodeAdded);
        this.nodes.nodeRemoved.remove(this.handleNodeRemoved);
        for (let node = this.nodes?.head; node; node = node.next) {
            this.handleNodeRemoved(node);
        }
        this.nodes = undefined;
    }

    update(time: number): void {
        for (let node = this.nodes?.head; node; node = node.next) {
            if (node.shaker.age <= 0) {
                this.creator.shakeTile(node.tile, false);
            } else {
                node.transform.position.x = node.shaker.currentX;
                node.transform.position.y = node.shaker.currentY;
            }
            node.shaker.age -= time;
        }
    }

    private handleNodeAdded = (node: TileShakingNode) => {
        console.log('handleNodeAdded')
        node.shaker.startX = node.transform.position.x;
        node.shaker.startY = node.transform.position.y;
        node.shaker.currentX = node.shaker.startX;
        node.shaker.currentY = node.shaker.startY;
    }

    private handleNodeRemoved = (node: TileShakingNode) => {
        console.log('handleNodeRemoved')
        node.transform.position.x = node.shaker.startX
        node.transform.position.y = node.shaker.startY;
    }
}