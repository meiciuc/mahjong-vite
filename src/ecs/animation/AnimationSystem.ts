import { ListIteratingSystem } from "@ash.ts/ash";
import { AnimationNode } from "./nodes/AnimationNode";

export class AnimationSystem extends ListIteratingSystem<AnimationNode> {
    public constructor() {
        super(AnimationNode);
    }

    updateNode(node: AnimationNode, time: number): void {
        node.animation.animation.animate(time);
    }
}