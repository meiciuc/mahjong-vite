import { Engine, Entity, EntityStateMachine } from '@ash.ts/ash';
import { Assets, Container, Sprite, Texture } from 'pixi.js';
import { Config } from '../Config';
import { stageService } from '../core/services/StageService';
import { GridView } from '../view/GridView';
import { TileHelpEffectView } from '../view/TileHelpEffectView';
import { Display } from './display/components/Display';
import { Transform } from './display/components/Transform';
import { Game } from './game/components/Game';
import { GameNode } from './game/nodes/GameNode';
import { Grid } from './tiles/components/Grid';
import { GridPosition } from './tiles/components/GridPosition';
import { Icon } from './tiles/components/Icon';
import { Selected } from './tiles/components/Selected';
import { Tile, TileStateEnum } from './tiles/components/Tile';
import { TileHelpEffect } from './tiles/components/TileHelpEffect';
import { GridNode } from './tiles/nodes/GridNode';
import { TileNode } from './tiles/nodes/TileNode';
import { dataService } from '../core/services/DataService';
import { GameModel } from '../model/GameModel';

export class EntityCreator {
    constructor(private engine: Engine, private gridView: GridView) {
        this.createPathTileTexture();
    }

    public getEngine() {
        return this.engine;
    }

    public getTileNodeByGridPosition(x: number, y: number) {
        const list = this.engine.getNodeList(TileNode);
        for (let node = list.head; node; node = node.next) {
            if (node.gridPosition.x === x && node.gridPosition.y === y) {
                return node;
            }
        }
        return undefined;
    }

    public createGame() {
        const list = this.engine.getNodeList(GameNode);
        while (list.head) {
            this.engine.removeEntity(list.head.entity);
        }

        const entity = new Entity();
        entity.add(new Game(dataService.getRootModel()));
        this.engine.addEntity(entity);
    }

    public createTileHelpEffect(x: number, y: number) {
        const entity = new Entity();

        entity
            .add(new TileHelpEffect())
            .add(new Display(new TileHelpEffectView(), this.gridView.effects))
            .add(new Transform({ x, y }));

        this.engine.addEntity(entity);
    }

    icons: { [key: string]: Texture } = {};

    public createTile(index: number, gridX: number, gridY: number) {
        const icon = dataService.getRootModel<GameModel>().data.icons[index];
        const tex = this.icons[icon.key]; //this.getIconTexture(index);
        const sprite = new Sprite(tex);

        const entity = new Entity();
        const fsm = new EntityStateMachine(entity);

        fsm.createState(TileStateEnum.IDLE);

        fsm.createState(TileStateEnum.SELECTED).add(Selected);

        entity
            .add(new Tile(fsm))
            .add(new GridPosition(gridX, gridY))
            .add(new Transform({ x: 0, y: 0 }))
            .add(new Display(sprite, this.gridView.tiles))
            .add(new Icon(icon));

        fsm.changeState(TileStateEnum.IDLE);

        this.engine.addEntity(entity);

        return entity;
    }

    public createPath(_x: number, _y: number) {
        const entity = new Entity();
        // const container = rootService.stage.make.container({}, false);
        // container.add(rootService.stage.make.image({key: 'hudbar'}, false));

        // entity
        //     .add(new Transform({x, y}))
        //     .add(new Display(container))

        this.engine.addEntity(entity);

        return entity;
    }

    public selectTile(tile: Tile, value: boolean) {
        tile.fsm.changeState(value ? TileStateEnum.SELECTED : TileStateEnum.IDLE);
    }

    public createGrid(grid: number[][]) {
        const list = this.engine.getNodeList(GridNode);
        while (list.head) {
            this.engine.removeEntity(list.head.entity);
        }

        const entity = new Entity();
        entity.add(new Grid(grid));
        this.engine.addEntity(entity);
    }

    public removeEntity(entity: Entity) {
        this.engine.removeEntity(entity);
    }

    public getGrid() {
        const list = this.engine.getNodeList(GridNode);
        return list.head?.grid.grid;
    }

    public getGridMatrix() {
        const list = this.engine.getNodeList(GridNode);
        return list.head?.grid.grid;
    }

    // TODO System
    private createPathTileTexture() {
        // var graphics = rootService.stage.make.graphics({}).fillStyle(0x00ff00, .1).fillRect(0, 0, Config.ICON_IMAGE_WIDTH, Config.ICON_IMAGE_WIDTH);
        // graphics.generateTexture('hudbar', Config.ICON_IMAGE_WIDTH, Config.ICON_IMAGE_WIDTH);
        // graphics.destroy();
    }

    // TODO сделать отдельный комманд (контроллер?)
    public async prepareIconTexures(keys: string[]) {
        const textures = Assets.cache.get(`./assets/${Config.ASSETST_ICONS_VERSION}/icons_atlas.json`).textures;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (this.icons[key] === undefined) {
                const sprite = new Sprite(textures[key]);
                sprite.scale.set(Config.ICON_IMAGE_SCALE);
                const container = new Container();
                container.addChild(sprite);

                const image = await stageService.stage.renderer.extract.image(container);
                const tex = Texture.from(image);
                this.icons[key] = tex;
            }
        }
    }
}
