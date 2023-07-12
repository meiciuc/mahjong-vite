import { Engine, Entity, EntityStateMachine } from '@ash.ts/ash';
import { Assets, Sprite, Texture } from 'pixi.js';
import { Config } from '../Config';
import { dataService } from '../core/services/DataService';
import { GameModel } from '../model/GameModel';
import { PointLike } from '../utils/point';
import { GridView } from '../view/GridView';
import { PathAnimatedLikeSnakeView } from '../view/PathAnimatedLikeSnakeView';
import { PathView } from '../view/PathView';
import { AnimationComponent } from './animation/components/AnimationComponent';
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
export class EntityCreator {
    constructor(private engine: Engine, private gridView: GridView) {
        const textures = Assets.cache.get(`./assets/${Config.ASSETST_ICONS_VERSION}/icons_atlas.json`).textures;
        this.icons = textures;
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

        const view = new PathView(this.createPath());
        entity
            .add(new TileHelpEffect())
            .add(new Display(view, this.gridView.effects))
            .add(new Transform({ x, y }));
        this.engine.addEntity(entity);
    }

    icons: { [key: string]: Texture } = {};

    public createTile(index: number, gridX: number, gridY: number) {
        const icon = dataService.getRootModel<GameModel>().data.icons[index];
        const tex = this.icons[icon.key]; //this.getIconTexture(index);
        const sprite = new Sprite(tex);

        const scale = Math.max(Config.ICON_IMAGE_WIDTH / sprite.width, Config.ICON_IMAGE_HEIGHT / sprite.height);
        sprite.scale.set(scale);

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

    public selectTile(tile: Tile, value: boolean) {
        tile.fsm.changeState(value ? TileStateEnum.SELECTED : TileStateEnum.IDLE);
    }

    private createPath() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgPath.setAttribute('style', "fill: none; stroke: #fff; stroke-width: 1");
        
        svg.appendChild(svgPath);

        const w = Config.ICON_IMAGE_WIDTH;
        const h = Config.ICON_IMAGE_HEIGHT;
        const r = Math.floor((Config.ICON_IMAGE_WIDTH + Config.ICON_IMAGE_HEIGHT) / 2 * .25);
        const d = `M ${r} ${0} L ${w - r} ${0} Q ${w} ${0} ${w} ${r} L ${w} ${h - r} Q ${w} ${h} ${w - r} ${h} L ${r} ${h} Q ${0} ${h} ${0} ${h - r} L ${0} ${r} Q ${0} ${0} ${r} ${0}`;
        svgPath.setAttribute('d', d);
        return svg;
    }

    public showPath(arr: PointLike[]) {
        if (arr.length === 0) {
            return;
        }
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgPath.setAttribute('style', "fill: none; stroke: #fff; stroke-width: 1");
        
        svg.appendChild(svgPath);

        const w = Config.ICON_IMAGE_WIDTH;
        const h = Config.ICON_IMAGE_HEIGHT;
        const dX = Config.ICON_IMAGE_WIDTH / 2;
        const dY = Config.ICON_IMAGE_HEIGHT / 2;
        let d = `M ${arr[0].x * w + dX} ${arr[0].y * h + dY}`;
        for (let i = 1; i < arr.length; i++) {
            d += ` L ${arr[i].x * w + dX} ${arr[i].y * h + dY}`;
        }
        svgPath.setAttribute('d', d);

        const entity = new Entity();

        // const view = new PathAnimatedView(svg);
        const view = new PathAnimatedLikeSnakeView(svg);
        entity
            .add(new TileHelpEffect())
            .add(new Transform())
            .add(new Display(view, this.gridView.effects))
            .add(new AnimationComponent(view))

        this.engine.addEntity(entity);

        return entity;
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
}
