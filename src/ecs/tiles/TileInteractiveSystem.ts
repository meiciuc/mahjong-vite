/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Engine, NodeList, System } from "@ash.ts/ash";
// import { GameStateEnum } from "../GameStateEnum";
import { GameNode } from "../game/nodes/GameNode";
import { TileNode } from "./nodes/TileNode";
import { TileSelectedNode } from "./nodes/TileSelectedNode";
import { EntityCreator } from "../EntityCreator";
import { GameStateEnum } from "../game/GameStateEnum";

export class TileInteractiveSystem extends System {

    private tiles?: NodeList<TileNode>;
    private tilesSelected?: NodeList<TileSelectedNode>;
    private game?: NodeList<GameNode>;

    // private lastGameObjectPointedDown: Phaser.GameObjects.GameObject | undefined;

    constructor(
        private creator: EntityCreator
    ) {
        super()
    }

    addToEngine(engine: Engine): void {
        this.tiles = engine.getNodeList(TileNode);
        this.tiles.nodeAdded.add(this.handleTileAdded);

        this.tilesSelected = engine.getNodeList(TileSelectedNode);

        this.game = engine.getNodeList(GameNode);

        // stageService.stage.input.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleGameObjectDown);
        // stageService.stage.input.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleGameObjectUp);
    }

    removeFromEngine(_engine: Engine): void {
        // this.tiles.nodeAdded.remove(this.handleTileAdded);

        // stageService.stage.input.off(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleGameObjectDown);
        // stageService.stage.input.off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleGameObjectUp);
    }

    update(_time: number): void {
        
    }

    private handleTileAdded = (node: TileNode) => {
        // node.display.view.setInteractive(
        //     new Phaser.Geom.Rectangle(
        //         0,
        //         0, 
        //         Config.ICON_IMAGE_WIDTH, 
        //         Config.ICON_IMAGE_HEIGHT
        //     ),
        //     Phaser.Geom.Rectangle.Contains
        // );
        // node.display.view.input.cursor = 'pointer';
        node.display.view.interactive = true;
        node.display.view.cursor = 'pointer';
        node.display.view.on('mouseup', this.handleClick)
    }

    private handleClick = (e: any) => {
        if (!this.isHandable()) {
            return;
        }

        for (let node = this.tiles?.head; node; node = node.next) {
            if (node.display.view === e.target) {
                this.clickTile(node);
            }
        }
    }

    // private handleGameObjectDown = (pointer: Phaser.Input.Pointer, arr: Array<any>) => {
    //     if (!this.isHandable()) {
    //         return;
    //     }
    //     this.lastGameObjectPointedDown = arr[0];
    // }

    // private handleGameObjectUp = (pointer: Phaser.Input.Pointer, arr: Array<any>) => {
    //     if (!this.isHandable()) {
    //         return;
    //     }
    //     const temp = this.lastGameObjectPointedDown;
    //     this.lastGameObjectPointedDown = undefined;

    //     const target = arr[0];
    //     if (temp !== target) {
    //         return;
    //     }
        
    //     for (let node = this.tiles.head; node; node = node.next) {
    //         if (node.display.view === target) {
    //             this.clickTile(node);
    //         }
    //     }
    // }

    private clickTile(node: TileNode) {
        for (let selected = this.tilesSelected?.head; selected; selected = selected.next) {
            if (selected.tile.id === node.tile.id) {
                this.creator.selectTile(node.tile, false);
                return;
            }
        }

        this.creator.selectTile(node.tile, true);
    }

    private isHandable() {
        return this.game?.head?.game.state === GameStateEnum.CLICK_WAIT;
    }
    
}