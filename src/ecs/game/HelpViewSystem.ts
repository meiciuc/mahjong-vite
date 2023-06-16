import { Engine, NodeList, System } from '@ash.ts/ash';
import { Container, Sprite, Text, Texture } from 'pixi.js';
import { BaseButton } from '../../core/mvc/BaseButton';
import { stageService } from '../../core/services/StageService';
import { LAYERS } from '../../GameLayers';
import { EntityCreator } from '../EntityCreator';
import { TileSelectedNode } from '../tiles/nodes/TileSelectedNode';
import { GameLogic } from './GameLogic';
import { TileHelpEffectNode } from '../tiles/nodes/TileHelpEffectNode';
import { throwIfNull } from '../../common/throwIfNull';

export class HelpViewSystem extends System {
    private helpButton?: BaseButton;
    private helpNodes?: NodeList<TileHelpEffectNode>;
    private selectedNodes?: NodeList<TileSelectedNode>;

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
    }

    update(_time: number): void {}

    private async setup() {
        this.helpButton = await this.createButton();
        this.helpButton.on('click', this.handleHelpButton);
        stageService.getLayer(LAYERS.UI).addChild(this.helpButton);
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

    private async createButton(): Promise<BaseButton> {
        const container = new Container();

        const text = new Text('need help', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0x000000,
            align: 'center',
        });

        const background = new Sprite(Texture.WHITE);
        background.width = text.width + 20;
        background.height = text.height + 10;

        container.addChild(background);
        container.addChild(text);
        text.position.set(10, 5);

        const image = await stageService.stage.renderer.extract.image(container);
        return new BaseButton(Texture.from(image));
    }
}
