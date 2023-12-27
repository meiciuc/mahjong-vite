import { Engine, NodeList, System } from "@ash.ts/ash";
import { SoundNode } from "./nodes/SoundNode";
import { Howl } from "howler";
import { AgeComponent } from "../age/components/AgeComponent";


export class SoundSystem extends System {

    private sounds?: NodeList<SoundNode>;

    addToEngine(engine: Engine): void {
        this.sounds = engine.getNodeList(SoundNode);
        this.sounds.nodeAdded.add(this.handleSoundAdd);
    }

    removeFromEngine(engine: Engine): void {
        while (this.sounds?.head) {
            engine.removeEntity(this.sounds.head.entity)
        }
        this.sounds = undefined;
    }

    update(time: number): void {
        for (let node = this.sounds?.head; node; node = node.next) {
            if (!node.sound.loop) {
                node.entity.add(new AgeComponent(0));
            }
        }
    }

    private handleSoundAdd = (node: SoundNode) => {
        new Howl({ src: node.sound.id }).play();
    }

}