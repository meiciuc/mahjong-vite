import { Engine, NodeList, System } from '@ash.ts/ash';
import { throwIfNull } from '../../utils/throwIfNull';
import { EntityCreator } from '../EntityCreator';
import { TileHelpEffectNode } from '../tiles/nodes/TileHelpEffectNode';
import { TileSelectedNode } from '../tiles/nodes/TileSelectedNode';
import { GameLogic } from './GameLogic';
import { htmlService } from '../../core/services/HtmlService';
import { createApp } from 'vue';
import TestButton from '../../vue/TestButton.vue';
import mitt from '../../utils/mitt';

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
        // this.createButtonAlt();
        // this.createButtonAlt();

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

        htmlService.ui.appendChild(button);

        return button;
    }

    private createButtonAlt() {
        const app = createApp(TestButton);
        app.config.globalProperties.emitter = mitt();
        app.mount(htmlService.ui.appendChild(document.createElement('div')));
        // app.provide('emitter', mitt());

        // app.config.globalProperties.emitter.on('click', () => {
        //     console.log('args CLICK')
        // })
    }
}
