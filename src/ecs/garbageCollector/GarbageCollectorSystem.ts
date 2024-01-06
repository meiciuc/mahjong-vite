import { Engine, NodeList, System } from "@ash.ts/ash";
import { SnakeNode } from "./nodes/SnakeNode";
import { AroundTileNode } from "./nodes/AroundTileNode";
import { DisplayNode } from "../display/nodes/DisplayNode";

export class GarbageCollectorSystem extends System {
    private snakeEffects?: NodeList<SnakeNode>;
    private around?: NodeList<AroundTileNode>;
    private display?: NodeList<DisplayNode>;

    addToEngine(engine: Engine): void {
        this.snakeEffects = engine.getNodeList(SnakeNode);
        this.snakeEffects.nodeRemoved.add(this.handleSnakeRemoved);

        this.around = engine.getNodeList(AroundTileNode);
        this.around.nodeRemoved.add(this.handleAroundRemoved);

        this.display = engine.getNodeList(DisplayNode);
        this.display.nodeRemoved.add(this.handleDisplayRemoved);
    }

    removeFromEngine(_engine: Engine): void {
        this.snakeEffects.nodeRemoved.remove(this.handleSnakeRemoved);
        this.snakeEffects = undefined;

        this.around.nodeRemoved.remove(this.handleAroundRemoved);
        this.around = undefined;

        this.display.nodeRemoved.remove(this.handleDisplayRemoved);
        this.display = undefined;
    }

    update(_time: number): void {

    }

    private handleSnakeRemoved = (node: SnakeNode) => {
        node.snake.svg.remove();
        node.snake.destroy({ children: true });
    }

    private handleAroundRemoved = (node: AroundTileNode) => {
        node.around.svg.remove();
        node.around.destroy({ children: true });
    }

    private handleDisplayRemoved = (node: DisplayNode) => {
        node.display.view.destroy({ children: true });
    }

}