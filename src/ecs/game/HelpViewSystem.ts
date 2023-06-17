import { Engine, NodeList, System } from '@ash.ts/ash';
import { throwIfNull } from '../../common/throwIfNull';
import { EntityCreator } from '../EntityCreator';
import { TileHelpEffectNode } from '../tiles/nodes/TileHelpEffectNode';
import { TileSelectedNode } from '../tiles/nodes/TileSelectedNode';
import { GameLogic } from './GameLogic';

export class HelpViewSystem extends System {
    private helpNodes?: NodeList<TileHelpEffectNode>;
    private selectedNodes?: NodeList<TileSelectedNode>;

    private helpButton?: HTMLDivElement;

    constructor(private creator: EntityCreator, private gameLogic: GameLogic) {
        super();
    }

    addToEngine(engine: Engine): void {
        this.helpNodes = engine.getNodeList(TileHelpEffectNode);
        this.selectedNodes = engine.getNodeList(TileSelectedNode);
        this.selectedNodes.nodeAdded.add(this.handleSelectedNodeAdded);
        this.setup();
    }

    removeFromEngine(_engine: Engine): void {
        this.helpNodes = undefined;
        this.selectedNodes?.nodeAdded.remove(this.handleSelectedNodeAdded);
        this.selectedNodes = undefined;

        this.helpButton?.remove();
    }

    update(_time: number): void {}

    private async setup() {
        this.helpButton = this.createButton();
    }

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

    private createButton() {
        let ui: HTMLDivElement | null = document.body.querySelector('#ui');
        if (!ui) {
            ui = document.createElement('div') as HTMLDivElement;
            ui.style.position = 'absolute';
            ui.style.top = '0px';
            ui.style.left = '0px';
            ui.id = 'ui';
            document.body.appendChild(ui);
        }

        const template = 'help';
        const button = document.createElement('div');
        button.innerHTML = template;
        button.style.border = 'solid';
        button.style.borderRadius = '15px';
        button.style.width = '100px';
        button.style.height = '20px';
        button.style.textAlign = 'center';
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => {this.handleHelpButton()})
        ui.appendChild(button);

        return button;
    }
}
