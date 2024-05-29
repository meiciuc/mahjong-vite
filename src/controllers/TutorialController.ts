import { NodeList } from "@ash.ts/ash";
import { Tween } from "@tweenjs/tween.js";
import { Point, Sprite } from "pixi.js";
import { dataService } from "../core/services/DataService";
import { stageService } from "../core/services/StageService";
import easingsFunctions from "../core/utils/easingsFunctions";
import { GameLogic } from "../ecs/game/GameLogic";
import { Interactive } from "../ecs/tiles/components/Interactive";
import { TileNode } from "../ecs/tiles/nodes/TileNode";
import { TileSelectedNode } from "../ecs/tiles/nodes/TileSelectedNode";
import { AppStateEnum, BoosterType, GameModel } from "../model/GameModel";
import { GameModelHelper } from "../model/GameModelHelper";
import { TimeSkipper } from "../utils/TimeSkipper";
import { throwIfNull } from "../utils/throwIfNull";
import { VueServiceSignals, vueService } from "../vue/VueService";
import { GameController } from "./GameController";
import { Pointer } from "./tutorial/Pointer";
import { Config } from "../Config";

export class TutorialController extends GameController {

    private tiles: NodeList<TileNode>;
    private pointer: Pointer;
    private leaveTutoralButton: HTMLDivElement;
    private menuTimer: HTMLDivElement;
    private menuHelp: HTMLDivElement;
    private menuLevel: HTMLDivElement;
    private gridScenario = [
        2, 2,
        3, 2,
        3, 3,
        4, 2,
        1, 2,
        1, 5,
        2, 1,
        1, 3,
    ];

    private savedModelData: { [key: string]: number } = {};

    private async playScenario() {
        this.tiles = this.engine?.getNodeList(TileNode);
        this.tiles.nodeAdded.add((node) => {
            node.entity.remove(Interactive);
        })

        await new TimeSkipper(1000).execute();

        for (let i = 0; i < this.gridScenario.length; i += 2) {
            let node = this.getTileNodeByGridPosition(this.gridScenario[i], this.gridScenario[i + 1]);
            if (!node) {
                continue;
            }
            this.movePointerToTile([node], 300);
            await new TimeSkipper(500).execute();

            node = this.getTileNodeByGridPosition(this.gridScenario[i], this.gridScenario[i + 1]);
            this.shakeTile(node);
            node.entity.add(new Interactive());

            await this.waitTileClick();

            node = this.getTileNodeByGridPosition(this.gridScenario[i], this.gridScenario[i + 1]);
            node.entity.remove(Interactive);

            if (i % 4 > 0) {
                await new TimeSkipper(1000).execute();
            }
        }

        await this.waitClickTimer();
        await this.waitClickHelper();

        await this.waitTileRemoved();

        // the pointer destroing
        await this.pointer.movePointer(new Point(window.innerWidth / 2, window.innerHeight / 2), new Point(window.innerWidth / 2, window.innerHeight / 2), 2000);
        await new TimeSkipper(3000).execute();
        await this.pointer.movePointer(new Point(), new Point(window.innerWidth, window.innerHeight), 100);
        this.pointer.destroy();

        // finish game yourself
        await new TimeSkipper(500).execute();
        for (let node = this.tiles.head; node; node = node.next) {
            node.entity.add(new Interactive());
            this.shakeTile(node);
            await new TimeSkipper(50).execute();
        }
    }

    protected async doExecute() {
        super.doExecute();

        Config.DEV_HELP_LOGIC_IS_RANDOM = false;
        Config.DEV_SAVE_RESULT = false;
        GameModelHelper.setBooster(BoosterType.HELP, 1);
        GameModelHelper.setBooster(BoosterType.TIME, 1);

        await new TimeSkipper(1000).execute();

        this.setupPointer();
        this.setupLeaveTutorialButton();
        this.setupGameMenu();

        dataService.getRootModel<GameModel>().subscribe(['appState'], this.handleAppStateChangeExtended);

        this.playScenario();

        stageService.resizeSignal.add(this.handleResize);
    }

    update = (time: number) => {
        this.engine?.update(time);

        const model = dataService.getRootModel<GameModel>().data;
        if (model.gameAge < 4) {
            model.gameAge = 4;
        }

        if (this.gameIsOver()) {
            this.complete();
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
        if (this.menuLevel) {
            this.menuLevel.style.pointerEvents = 'auto';
        }

        if (this.leaveTutoralButton) {
            this.leaveTutoralButton.remove();
        }

        if (this.pointer) {
            this.pointer.destroy();
        }

        Config.DEV_HELP_LOGIC_IS_RANDOM = true;
        Config.DEV_SAVE_RESULT = true;
        this.resetTutorialModel();
        GameModelHelper.updateGameModel();

        super.destroy();
    }

    private leaveTutorial() {
        vueService.signalDataBus.dispatch(VueServiceSignals.LeaveTutorial, {});
    }

    protected setupGameLogic() {

        this.saveCurrentModel();

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

    private saveCurrentModel() {
        this.savedModelData['gameLevel'] = GameModelHelper.getGameLevel();
        this.savedModelData['gameScore'] = GameModelHelper.getGameScore();
        this.savedModelData['HELP'] = GameModelHelper.getBooster(BoosterType.HELP).current;
        this.savedModelData['TIME'] = GameModelHelper.getBooster(BoosterType.TIME).current;
    }

    private resetTutorialModel() {
        GameModelHelper.setGameLevel(this.savedModelData['gameLevel']);
        GameModelHelper.setGameScore(this.savedModelData['gameScore']);
        GameModelHelper.setBooster(BoosterType.HELP, this.savedModelData['HELP']);
        GameModelHelper.setBooster(BoosterType.TIME, this.savedModelData['TIME']);
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
        const menuLevel = document.body.getElementsByClassName('MenuPanel__GameMenuLevel');

        if (!menuTimer.length || !menuHelp.length || !menuLevel.length) {
            return;
        }

        this.menuTimer = menuTimer[0] as HTMLDivElement;
        this.menuTimer.style.pointerEvents = 'none';

        this.menuHelp = menuHelp[0] as HTMLDivElement;
        this.menuHelp.style.pointerEvents = 'none';

        this.menuLevel = menuLevel[0] as HTMLDivElement;
        this.menuLevel.style.pointerEvents = 'none';

        dataService.getRootModel<GameModel>().data.gameAge = 21;
    }

    private setupLeaveTutorialButton() {
        // TODO icon
        this.leaveTutoralButton = document.createElement('div');
        this.leaveTutoralButton.style.width = '4rem';
        this.leaveTutoralButton.style.height = '4rem';
        this.leaveTutoralButton.style.position = 'absolute';
        this.leaveTutoralButton.style.right = '2em';
        this.leaveTutoralButton.style.bottom = '2em';
        this.leaveTutoralButton.style.cursor = 'pointer';
        this.leaveTutoralButton.style.backgroundImage = 'url(./assets/svg/exit.svg)';
        this.leaveTutoralButton.style.backgroundRepeat = 'no-repeat';
        this.leaveTutoralButton.style.filter = 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.5))';

        this.leaveTutoralButton.onpointerover = () => {
            this.leaveTutoralButton.style.filter = 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5))';
        }

        this.leaveTutoralButton.onpointerout = () => {
            this.leaveTutoralButton.style.filter = 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.5))';
        }

        this.leaveTutoralButton.onpointerdown = () => {
            this.leaveTutoralButton.style.filter = 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.5))';
        }

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

    private getCurrentIndex = () => { return { tl: new Point(), br: new Point() } };

    private shakeTile(node: TileNode) {
        this.creator.shakeTile(node.tile, true);
    }

    private movePointerToTile(node: TileNode[] | TileSelectedNode[], duration = 0) {

        const resultTL = new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        const resultBR = new Point(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

        for (let i = 0; i < node.length; i++) {
            const view = node[i].display.view;
            const { x, y, width, height } = view as Sprite;

            this.getCurrentIndex = () => {
                if (view && x && y && width && height) {

                    const tl = view.toGlobal(new Point(0, 0));
                    const br = view.toGlobal(new Point(width, height));

                    const bounding = stageService.stage.view.getBoundingClientRect();
                    tl.y += bounding.y;
                    br.y += bounding.y;

                    return { tl, br };
                }

                return { tl: new Point(), br: new Point() };
            }
            const { tl, br } = this.getCurrentIndex();
            resultTL.x = Math.min(resultTL.x, tl.x);
            resultTL.y = Math.min(resultTL.y, tl.y);
            resultBR.x = Math.max(resultBR.x, br.x);
            resultBR.y = Math.max(resultBR.y, br.y);
        }

        this.pointer?.movePointer(resultTL, resultBR, duration);
    }

    private async waitTileClick() {
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

    private async waitTileRemoved() {
        return new Promise(async resolve => {
            const tiles = this.creator.getEngine().getNodeList(TileNode);

            const executed = (_node: TileNode) => {
                tiles.nodeRemoved.remove(executed);
                resolve(true);
            }

            tiles.nodeRemoved.add(executed);
        });
    }

    private shakeHtmlDiv(div: HTMLDivElement) {
        const delta = 5;
        const easing = easingsFunctions.easeOutSine;
        new Tween({})
            .to({}, 300)
            .onUpdate((_object: unknown, t: number) => {
                const currentX = (Math.random() * delta * (Math.random() > 0.5 ? 1 : -1)) * easing(t);
                const currentY = (Math.random() * delta * (Math.random() > 0.5 ? 1 : -1)) * easing(t);
                div.style.transform = `translate(${currentX}px, ${currentY}px)`;
            })
            .onComplete(() => {
                div.style.transform = `translate(${0})`;
            })
            .start();
    }

    private async waitClickTimer() {
        if (!this.menuTimer) {
            return;
        }

        this.getCurrentIndex = () => {
            const bounding = this.menuTimer.getBoundingClientRect();
            return { tl: new Point(bounding.x, bounding.y), br: new Point(bounding.right, bounding.bottom) };
        }

        const { tl, br } = this.getCurrentIndex();
        this.pointer?.movePointer(new Point(tl.x, tl.y), new Point(br.x, br.y), 300);

        await new TimeSkipper(500).execute();
        this.shakeHtmlDiv(this.menuTimer);



        this.menuTimer.style.pointerEvents = 'auto';
        await this.waitMenuClick(VueServiceSignals.BoosterTimeClick);
        this.menuTimer.style.pointerEvents = 'none';
    }

    private async waitClickHelper() {
        if (!this.menuHelp) {
            return;
        }

        this.getCurrentIndex = () => {
            const bounding = this.menuHelp.getBoundingClientRect();
            return { tl: new Point(bounding.x, bounding.y), br: new Point(bounding.right, bounding.bottom) };
        };

        const { tl, br } = this.getCurrentIndex();
        this.pointer?.movePointer(tl, br, 300);

        await new TimeSkipper(500).execute();
        this.shakeHtmlDiv(this.menuHelp);

        this.menuHelp.style.pointerEvents = 'auto';
        await this.waitMenuClick(VueServiceSignals.BoosterHelpClick);
        this.menuHelp.style.pointerEvents = 'none';

        const arr = await this.gameLogic.needHelp();
        if (arr.length) {
            let nodeA = throwIfNull(this.creator.getTileNodeByGridPosition(arr[0].x, arr[0].y));
            const nodeAId = nodeA.tile.id;
            await this.movePointerToTile([nodeA], 300);
            await new TimeSkipper(1000).execute();

            nodeA = throwIfNull(this.creator.getTileNodeByGridPosition(arr[0].x, arr[0].y));
            const nodeB = throwIfNull(this.creator.getTileNodeByGridPosition(arr[arr.length - 1].x, arr[arr.length - 1].y));
            const nodeBId = nodeB.tile.id;
            const entityA = nodeA.entity;
            const entityB = nodeB.entity;
            await this.movePointerToTile([nodeA, nodeB], 300);
            await new TimeSkipper(300).execute();

            this.shakeTile(this.creator.getTileNodeById(nodeAId));
            this.shakeTile(this.creator.getTileNodeById(nodeBId));

            entityA.add(new Interactive());
            entityB.add(new Interactive());
        }
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

    private handleResize = () => {
        const { tl, br } = this.getCurrentIndex();
        this.pointer?.movePointer(new Point(tl.x, tl.y), new Point(br.x, br.y), 0);
    }
}