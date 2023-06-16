import { Engine, NodeList, System } from '@ash.ts/ash';
import { DisplayNode } from './nodes/DisplayNode';

export class DisplaySystem extends System {
    private displays?: NodeList<DisplayNode>;

    addToEngine(engine: Engine): void {
        this.displays = engine.getNodeList(DisplayNode);
        this.displays.nodeAdded.add(this.handleNodeAdded);
        this.displays.nodeRemoved.add(this.handleNodeRemoved);
    }

    removeFromEngine(_engine: Engine): void {
        this.displays?.nodeAdded.add(this.handleNodeAdded);
        this.displays?.nodeRemoved.remove(this.handleNodeRemoved);
        this.displays = undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(_time: number): void {
        for (let node = this.displays?.head; node; node = node.next) {
            node.display.view.x = node.transform.position.x;
            node.display.view.y = node.transform.position.y;
        }
    }

    private handleNodeAdded = (node: DisplayNode) => {
        if (node.display.addToParent) {
            node.display.addToParent.addChild(node.display.view);
        }
    };

    private handleNodeRemoved = (node: DisplayNode) => {
        node.display.view.parent?.removeChild(node.display.view);
    };
}
