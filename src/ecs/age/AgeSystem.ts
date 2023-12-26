import { ListIteratingSystem } from "@ash.ts/ash";
import { EntityCreator } from "../EntityCreator";
import { AgeNode } from "./nodes/AgeNode";

export class AgeSystem extends ListIteratingSystem<AgeNode> {

    private creator?: EntityCreator;

    constructor(creator: EntityCreator) {
        super(AgeNode);
        this.creator = creator;
    }

    updateNode(node: AgeNode, delta: number): void {
        if (node.age.value <= 0) {
            this.creator.removeEntity(node.entity);
            return;
        }
        node.age.value -= delta;
    }
}