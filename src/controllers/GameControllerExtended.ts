import { NodeList } from "@ash.ts/ash";
import { Point, Sprite } from "pixi.js";
import { dataService } from "../core/services/DataService";
import { stageService } from "../core/services/StageService";
import { GameLogic } from "../ecs/game/GameLogic";
import { Interactive } from "../ecs/tiles/components/Interactive";
import { TileNode } from "../ecs/tiles/nodes/TileNode";
import { TileSelectedNode } from "../ecs/tiles/nodes/TileSelectedNode";
import { AppStateEnum, GameModel } from "../model/GameModel";
import { TimeSkipper } from "../utils/TimeSkipper";
import { VueServiceSignals, vueService } from "../vue/VueService";
import { GameController } from "./GameController";
import { Pointer } from "./tutorial/Pointer";

export class GameControllerExtended extends GameController {

    private tiles: NodeList<TileNode>;
    private pointer: Pointer;
    private leaveTutoralButton: HTMLButtonElement;
    private menuTimer: HTMLDivElement;
    private menuHelp: HTMLDivElement;
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
            if (!node) {
                continue;
            }
            node.entity.add(new Interactive());
            this.movePointerToTile(node, 300);
            await this.waitTileClick();
            node.entity.remove(Interactive);
        }

        await this.waitClickTimer();
        await this.waitClickHelper();

        // finish game yourself
        for (let node = this.tiles.head; node; node = node.next) {
            node.entity.add(new Interactive());
        }
    }

    protected async doExecute() {
        super.doExecute();

        // for menu initialization
        await new TimeSkipper(1000).execute();

        this.setupPointer();
        this.setupLeaveTutorialButton();
        this.setupGameMenu();

        dataService.getRootModel<GameModel>().subscribe(['appState'], this.handleAppStateChangeExtended);

        this.playScenario();
    }

    update = (time: number) => {
        this.engine?.update(time);

        const model = dataService.getRootModel<GameModel>().data;
        if (model.gameAge < 4) {
            model.gameAge = 4;
        }
    };

    destroy(): void {
        dataService.getRootModel<GameModel>().unsubscribe(['appState'], this.handleAppStateChangeExtended);
        if (this.menuTimer) {
            this.menuTimer.style.pointerEvents = 'auto';
        }
        if (this.menuHelp) {
            this.menuHelp.style.pointerEvents = 'auto';
        }

        if (this.leaveTutoralButton) {
            this.leaveTutoralButton.remove();
        }

        super.destroy();
    }

    complete() {
        // gamer finished tutorial like game
        // show special screen 
        super.complete();
    }

    private leaveTutorial() {
        // return to first page
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

    private setupGameMenu() {
        const menuTimer = document.body.getElementsByClassName('MenuPanel__GameMenuTimer');
        const menuHelp = document.body.getElementsByClassName('MenuPanel__GameMenuHelp');

        if (!menuTimer.length || !menuHelp.length) {
            return;
        }

        this.menuTimer = menuTimer[0] as HTMLDivElement;
        this.menuTimer.style.pointerEvents = 'none';

        this.menuHelp = menuHelp[0] as HTMLDivElement;
        this.menuHelp.style.pointerEvents = 'none';

        dataService.getRootModel<GameModel>().data.gameAge = 21;
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

        this.leaveTutoralButton.onclick = () => this.leaveTutorial();
        this.leaveTutoralButton.ontouchstart = () => this.leaveTutorial();
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

    private async waitClickTimer() {
        if (!this.menuTimer) {
            return;
        }

        const bounding = this.menuTimer.getBoundingClientRect();
        this.pointer?.movePointer(new Point(bounding.x, bounding.y), new Point(bounding.right, bounding.bottom), 300);

        this.menuTimer.style.pointerEvents = 'auto';

        await this.waitMenuClick(VueServiceSignals.BoosterTimeClick);

        this.menuTimer.style.pointerEvents = 'none';
    }

    private async waitClickHelper() {
        if (!this.menuHelp) {
            return;
        }

        const bounding = this.menuHelp.getBoundingClientRect();
        this.pointer?.movePointer(new Point(bounding.x, bounding.y), new Point(bounding.right, bounding.bottom), 300);

        this.menuHelp.style.pointerEvents = 'auto';
        await this.waitMenuClick(VueServiceSignals.BoosterHelpClick);

        const list = this.engine.getNodeList(TileSelectedNode);
        for (let node = list.head; node; node = node.next) {
            node.entity.add(new Interactive());
        }

        this.menuHelp.style.pointerEvents = 'none';
    }

    private async waitMenuClick(value: VueServiceSignals) {
        return new Promise(res => {
            const handler = (signal: VueServiceSignals) => {
                if (signal === value) {
                    vueService.signalDataBus.off(handler);
                    res(true);
                }
            }

            vueService.signalDataBus.on(handler)
        });
    }
}