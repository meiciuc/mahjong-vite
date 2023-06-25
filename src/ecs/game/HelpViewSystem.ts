import { Engine, NodeList, System } from '@ash.ts/ash';
import { throwIfNull } from '../../utils/throwIfNull';
import { vueService } from '../../vue/VueService';
import { EntityCreator } from '../EntityCreator';
import { TileHelpEffectNode } from '../tiles/nodes/TileHelpEffectNode';
import { TileSelectedNode } from '../tiles/nodes/TileSelectedNode';
import { GameLogic } from './GameLogic';

export class HelpViewSystem extends System {
    private helpNodes?: NodeList<TileHelpEffectNode>;
    private selectedNodes?: NodeList<TileSelectedNode>;

    constructor(private creator: EntityCreator, private gameLogic: GameLogic) {
        super();
    }

    addToEngine(engine: Engine): void {
        this.helpNodes = engine.getNodeList(TileHelpEffectNode);
        this.selectedNodes = engine.getNodeList(TileSelectedNode);
        this.selectedNodes.nodeAdded.add(this.handleSelectedNodeAdded);
        
        vueService.signalHelpButton.on(this.handleHelpButton);
    }

    removeFromEngine(_engine: Engine): void {
        this.helpNodes = undefined;
        this.selectedNodes?.nodeAdded.remove(this.handleSelectedNodeAdded);
        this.selectedNodes = undefined;

        vueService.signalHelpButton.off(this.handleHelpButton);
    }

    update(_time: number): void {}

    private handleSelectedNodeAdded = (_node: TileSelectedNode) => {
        while (this.helpNodes?.head) {
            this.creator.removeEntity(this.helpNodes.head.entity);
        }
    };

    private handleHelpButton = async () => {
        if (this.helpNodes?.head) {
            return;
        }
        const arr = await this.gameLogic.needHelp();

        const nodeA = throwIfNull(this.creator.getTileNodeByGridPosition(arr[0].x, arr[0].y));
        const nodeB = throwIfNull(this.creator.getTileNodeByGridPosition(arr[arr.length - 1].x, arr[arr.length - 1].y));

        this.creator.createTileHelpEffect(nodeA.transform.position.x, nodeA.transform.position.y);
        this.creator.createTileHelpEffect(nodeB.transform.position.x, nodeB.transform.position.y);
    };
}
