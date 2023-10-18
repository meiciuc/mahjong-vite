import { Engine, Entity, EntityStateMachine } from '@ash.ts/ash';
import { Assets, Sprite, Texture } from 'pixi.js';
import { Config } from '../Config';
import { dataService } from '../core/services/DataService';
import { GameModel } from '../model/GameModel';
import { PointLike } from '../utils/point';
import { GridView } from '../view/GridView';
import { PathAnimatedAroundTileView } from '../view/PathAnimatedAroundTileView';
import { PathAnimatedLikeSnakeView } from '../view/PathAnimatedLikeSnakeView';
import { TileAnimatedShakingView } from '../view/TileAnimatedShakingView';
import { AnimationComponent } from './animation/components/AnimationComponent';
import { Display } from './display/components/Display';
import { Transform } from './display/components/Transform';
import { Game } from './game/components/Game';
import { GameNode } from './game/nodes/GameNode';
import { Grid } from './tiles/components/Grid';
import { GridPosition } from './tiles/components/GridPosition';
import { Icon } from './tiles/components/Icon';
import { Interactive } from './tiles/components/Interactive';
import { Selected } from './tiles/components/Selected';
import { Tile, TileStateEnum } from './tiles/components/Tile';
import { TileHelpEffect } from './tiles/components/TileHelpEffect';
import { GridNode } from './tiles/nodes/GridNode';
import { TileNode } from './tiles/nodes/TileNode';
import { PathTileToggleView } from '../view/PathTileToggleView';
import { TileToggleEffect } from './tiles/components/TileToggleEffect';
import { throwIfNull } from '../utils/throwIfNull';
import { Destroing } from './tiles/components/Destroing';
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

    public getTileNodeById(id: number) {
        const list = this.engine.getNodeList(TileNode);
        for (let node = list.head; node; node = node.next) {
            if (node.tile.id === id) {
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

    public createTileToggleEffect(tileId: number) {
        const tile = throwIfNull(this.getTileNodeById(tileId));
        const entity = new Entity();

        const transform = new Transform({ x: tile.transform.position.x, y: tile.transform.position.y });
        const view = new PathTileToggleView();
        view.position.x = transform.position.x;
        view.position.y = transform.position.y;
        entity
            .add(new TileToggleEffect(tileId))
            .add(new Display(view, this.gridView.effectsTilesUnder))
            .add(transform);
        this.engine.addEntity(entity);
    }

    public createTileHelpEffect(x: number, y: number) {
        const entity = new Entity();

        const transform = new Transform({ x, y });
        const view = new PathAnimatedAroundTileView();
        view.position.x = transform.position.x;
        view.position.y = transform.position.y;
        entity
            .add(new TileHelpEffect())
            .add(new Display(view, this.gridView.effectsTilesAbove))
            .add(transform)
            .add(new AnimationComponent(view));
        this.engine.addEntity(entity);
    }

    icons: { [key: string]: Texture } = {};

    public createTile(index: number, gridX: number, gridY: number) {
        const icon = dataService.getRootModel<GameModel>().data.icons[index];
        const tex = this.icons[icon.key];
        const sprite = new Sprite(tex);

        const scale = Math.max(Config.ICON_IMAGE_WIDTH / sprite.width, Config.ICON_IMAGE_HEIGHT / sprite.height);
        sprite.scale.set(scale);

        const entity = new Entity();
        const fsm = new EntityStateMachine(entity);

        fsm.createState(TileStateEnum.IDLE).add(Object).withMethod(() => {
            // (entity.get(Display).view as Sprite).tint = 0xffffff;
            return {};
        });

        fsm.createState(TileStateEnum.SELECTED)
            .add(Selected).withMethod(() => {
                // (entity.get(Display).view as Sprite).tint = 0xff0000;
                return new Selected();
            });

        fsm.createState(TileStateEnum.DESTROING)
            .add(Destroing).withMethod(() => {
                entity.remove(Interactive);
                // (entity.get(Display).view as Sprite).tint = 0x660000;
                return new Destroing();
            });

        entity
            .add(new Tile(fsm))
            .add(new GridPosition(gridX, gridY))
            .add(new Transform({ x: 0, y: 0 }))
            .add(new Display(sprite, this.gridView.tiles))
            .add(new Icon(icon))
            .add(new Interactive());

        fsm.changeState(TileStateEnum.IDLE);

        this.engine.addEntity(entity);

        return entity;
    }

    public selectTile(tile: Tile, value: boolean) {
        tile.fsm.changeState(value ? TileStateEnum.SELECTED : TileStateEnum.IDLE);
    }

    public nonInteractiveTile(tile: Tile) {
        tile.fsm.changeState(TileStateEnum.DESTROING);
    }

    public shakeTile(tile: Tile, value: boolean) {
        const node = this.getTileNodeById(tile.id);
        if (!node) {
            return;
        }

        if (value) {
            const shaker = new TileAnimatedShakingView();
            node.entity.add(new AnimationComponent(shaker));
            node.entity.add(shaker);
        } else if (node.entity.has(TileAnimatedShakingView)) {
            node.entity.remove(TileAnimatedShakingView);
            node.entity.remove(AnimationComponent);
        }
    }

    public showPath(arr: PointLike[], duration = Config.PATH_LIKE_SNAKE_DURATION) {
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

        const view = new PathAnimatedLikeSnakeView(svg, duration);
        entity
            .add(new TileHelpEffect())
            .add(new Transform())
            .add(new Display(view, this.gridView.effectsTilesAbove))
            .add(new AnimationComponent(view))

        this.engine.addEntity(entity);

        return entity;
    }

    public createGrid(current: number[][], portrait: number[][], landscape: number[][]) {
        const list = this.engine.getNodeList(GridNode);
        while (list.head) {
            this.engine.removeEntity(list.head.entity);
        }

        const entity = new Entity();
        entity.add(new Grid(current, portrait, landscape));
        this.engine.addEntity(entity);
    }

    public removeEntity(entity: Entity) {
        this.engine.removeEntity(entity);
    }

    public getGrid() {
        const list = this.engine.getNodeList(GridNode);
        return list.head?.grid.current;
    }

    public getGridMatrix() {
        const list = this.engine.getNodeList(GridNode);
        return list.head?.grid.current;
    }
}
