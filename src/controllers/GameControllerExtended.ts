import { Point, Sprite } from "pixi.js";
import { dataService } from "../core/services/DataService";
import { GameLogic } from "../ecs/game/GameLogic";
import { TileNode } from "../ecs/tiles/nodes/TileNode";
import { AppStateEnum, GameModel, GameStateEnum } from "../model/GameModel";
import { GameController } from "./GameController";
import { Pointer } from "./tutorial/Pointer";
import { stageService } from "../core/services/StageService";
import { NodeList } from "@ash.ts/ash";
import { GameModelHelper } from "../model/GameModelHelper";
import { TileSelectedNode } from "../ecs/tiles/nodes/TileSelectedNode";
import { Interactive } from "../ecs/tiles/components/Interactive";
import { TimeSkipper } from "../utils/TimeSkipper";

export class GameControllerExtended extends GameController {

    private tiles: NodeList<TileNode>;
    private pointer: Pointer;
    private leaveTutoralButton: HTMLButtonElement;
    private gridScenario = [
        2, 2,
        3, 2,
        3, 3,
        4, 2,
        1, 2,
        1, 5,
        1, 3,
        2, 1
    ];

    private async playScenario() {
        console.log('playScenario')
        this.tiles = this.engine?.getNodeList(TileNode);
        this.tiles.nodeAdded.add((node) => {
            node.entity.remove(Interactive);
        })

        await new TimeSkipper(1000).execute();

        for (let node = this.tiles.head; node; node = node.next) {
            node.entity.remove(Interactive);
        }

        for (let i = 0; i < this.gridScenario.length; i += 2) {
            const node = this.getTileNodeByGridPosition(this.gridScenario[i], this.gridScenario[i + 1]);
            console.log(node)
            if (!node) {
                continue;
            }
            node.entity.add(new Interactive());
            this.movePointerToTile(node, 300);
            await this.waitTileClick();
            node.entity.remove(Interactive);
        }
    }

    protected async doExecute() {
        super.doExecute();

        this.setupPointer();
        this.setupLeaveTutorialButton();

        dataService.getRootModel<GameModel>().subscribe(['appState'], this.handleAppStateChangeExtended);

        this.playScenario();
    }

    update = (time: number) => {
        this.engine?.update(time);

        const model = dataService.getRootModel<GameModel>().data;
        model.gameAge -= time;
        if (model.gameAge < 4) {
            model.gameAge = 4;
        }
    };

    destroy(): void {
        dataService.getRootModel<GameModel>().unsubscribe(['appState'], this.handleAppStateChangeExtended);
        super.destroy();
    }

    protected setupGameLogic() {
        this.gameLogic = new GameLogic(this.engine);

        const config = this.gameLogic.getDefaultGenerateIconsConfig();
        config.gridWidth = 4;
        config.gridHeight = 5;
        config.seed = '0.6440902038163674';
        config.currentLevel = 4;
        config.pares = 1;

        const model = dataService.getRootModel<GameModel>();
        model.data.gameLevel = config.currentLevel;
        model.data.gridWidth = config.gridWidth;
        model.data.gridHeight = config.gridHeight;
        model.data.seed = config.seed;
        model.data.gameAge = 60;

        this.gameLogic.generateIconsQueue(config);
    }

    private showTutorialUI(value: boolean) {
        this.pointer.visible = value;
        this.leaveTutoralButton.style.opacity = `${value ? '1' : '0'}`;
        this.leaveTutoralButton.style.pointerEvents = `${value ? 'auto' : 'none'}`;
    }

    private setupPointer() {
        this.pointer = new Pointer();
    }

    private setupLeaveTutorialButton() {
        // TODO icon
        this.leaveTutoralButton = document.createElement('button');
        this.leaveTutoralButton.innerText = 'LEAVE';
        this.leaveTutoralButton.style.position = 'absolute';
        this.leaveTutoralButton.style.right = '1em';
        this.leaveTutoralButton.style.bottom = '1em';
        this.leaveTutoralButton.style.cursor = 'pointer';

        document.body.appendChild(this.leaveTutoralButton);

        this.leaveTutoralButton.onclick = () => this.complete();
        this.leaveTutoralButton.ontouchstart = () => this.complete();
    }

    private handleAppStateChangeExtended = (state: AppStateEnum) => {
        this.showTutorialUI(state === AppStateEnum.GAME_SCREEN);
    }

    private getTileNodeByGridPosition(x: number, y: number) {
        for (let node = this.tiles?.head; node; node = node.next) {
            if (node.gridPosition.x === x && node.gridPosition.y === y) {
                return node;
            }
        }
        return undefined;
    }

    private movePointerToTile(node: TileNode, duration = 0) {
        const view = node.display.view;
        const { x, y, width, height } = view as Sprite;
        if (view && x && y && width && height) {

            const tl = view.toGlobal(new Point(0, 0));
            const br = view.toGlobal(new Point(width, height));

            const bounding = stageService.stage.view.getBoundingClientRect();
            tl.y += bounding.y;
            br.y += bounding.y;

            this.pointer?.movePointer(tl, br, duration);
        }
    }

    private async waitTileClick() {
        // GameModelHelper.setGameState(GameStateEnum.CLICK_WAIT);
        return new Promise(async resolve => {
            const selected = this.creator.getEngine().getNodeList(TileSelectedNode);

            const executed = (node: TileSelectedNode) => {
                selected.nodeAdded.remove(executed);
                this.creator?.selectTile(node.tile, true);
                resolve(true);
            }

            selected.nodeAdded.add(executed);
        });
    }

}