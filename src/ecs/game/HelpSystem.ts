import { Engine, NodeList, System } from '@ash.ts/ash';
import { BoosterType, GameStateEnum } from '../../model/GameModel';
import { GameModelHelper } from '../../model/GameModelHelper';
import { throwIfNull } from '../../utils/throwIfNull';
import { VueServiceSignals, vueService } from '../../vue/VueService';
import { EntityCreator } from '../EntityCreator';
import { TileHelpEffectNode } from '../tiles/nodes/TileHelpEffectNode';
import { TileSelectedNode } from '../tiles/nodes/TileSelectedNode';
import { GameLogic } from './GameLogic';
import { saveDataService } from '../../services/SaveDataService';

export class HelpSystem extends System {
    private helpBoosterClicked = false;
    private helpEffectNodes?: NodeList<TileHelpEffectNode>;
    private selectedNodes?: NodeList<TileSelectedNode>;

    constructor(private creator: EntityCreator, private gameLogic: GameLogic) {
        super();
    }

    addToEngine(engine: Engine): void {
        this.helpEffectNodes = engine.getNodeList(TileHelpEffectNode);
        this.selectedNodes = engine.getNodeList(TileSelectedNode);
        this.selectedNodes.nodeAdded.add(this.handleSelectedNodeAdded);

        vueService.signalDataBus.on(this.handleSignalDataBus);
    }

    removeFromEngine(_engine: Engine): void {
        this.helpEffectNodes = undefined;
        this.selectedNodes?.nodeAdded.remove(this.handleSelectedNodeAdded);
        this.selectedNodes = undefined;

        vueService.signalDataBus.off(this.handleSignalDataBus);
    }

    update(_time: number): void {
        if (this.helpBoosterClicked) {
            this.helpBoosterClicked = false;
            this.help();
        }
    }

    private handleSelectedNodeAdded = (_node: TileSelectedNode) => {
        while (this.helpEffectNodes?.head) {
            this.creator.removeEntity(this.helpEffectNodes.head.entity);
        }
    };

    private handleSignalDataBus = (data: VueServiceSignals) => {
        if (data !== VueServiceSignals.BoosterHelpClick) {
            return;
        }

        if (GameModelHelper.getBooster(BoosterType.HELP).current <= 0) {
            return;
        }

        this.helpBoosterClicked = true;
    };

    private async help() {
        if (this.helpEffectNodes?.head) {
            return;
        }

        const boosters = GameModelHelper.getBooster(BoosterType.HELP)?.current;
        if (!boosters) {
            return;
        }

        const arr = await this.gameLogic.needHelp();
        if (arr.length === 0) {
            GameModelHelper.setGameState(GameStateEnum.GAME_NO_MORE_MOVES)
        } else {
            const nodeA = throwIfNull(this.creator.getTileNodeByGridPosition(arr[0].x, arr[0].y));
            const nodeB = throwIfNull(this.creator.getTileNodeByGridPosition(arr[arr.length - 1].x, arr[arr.length - 1].y));
            this.creator.createTileHelpEffect(nodeA.transform.position.x, nodeA.transform.position.y);
            this.creator.createTileHelpEffect(nodeB.transform.position.x, nodeB.transform.position.y);

            GameModelHelper.setBooster(BoosterType.HELP, Math.max(0, boosters - 1));
            saveDataService.saveData();
        }
    }
}
