import { Engine, NodeList, System } from '@ash.ts/ash';
import { throwIfNull } from '../../utils/throwIfNull';
import { Config } from '../../Config';
import { TimeSkipper } from '../../utils/TimeSkipper';
import { EntityCreator } from '../EntityCreator';
import { TileNode } from '../tiles/nodes/TileNode';
import { TileSelectedNode } from '../tiles/nodes/TileSelectedNode';
import { GameLogic } from './GameLogic';
import { GameStateEnum } from './GameStateEnum';
import { GameNode } from './nodes/GameNode';

export class GameSystem extends System {
    private game?: NodeList<GameNode>;
    private selectedTiles?: NodeList<TileSelectedNode>;
    private tiles?: NodeList<TileNode>;

    constructor(private creator: EntityCreator, private gameLogic: GameLogic) {
        super();
    }

    addToEngine(engine: Engine): void {
        this.tiles = engine.getNodeList(TileNode);
        this.selectedTiles = engine.getNodeList(TileSelectedNode);
        this.game = engine.getNodeList(GameNode);
        this.creator.createGame();
    }

    removeFromEngine(_engine: Engine): void {}

    update = (time: number): void => {
        if (!this.game?.head) {
            return;
        }

        this.game.head.game.stateTime += time;

        switch (this.game.head.game.state) {
            case GameStateEnum.NONE:
                let index = 0;
                const grid: number[][] = [];
                for (let y = 0; y < Config.GRID_HEIGHT + 2; y++) {
                    const row = grid[grid.push([]) - 1];
                    for (let x = 0; x < Config.GRID_WIDTH + 2; x++) {
                        if (y === 0 || x === 0 || y === Config.GRID_HEIGHT + 1 || x === Config.GRID_WIDTH + 1) {
                            // empty grid border for a-star
                            row.push(Config.GRID_EMPTY_VALUE);
                            continue;
                        }

                        this.creator.createTile(this.gameLogic.getIcon(index % Config.ASSETST_ICONS_NUMBER), x, y);
                        row.push(throwIfNull(this.tiles?.tail).tile.id);

                        index++;
                    }
                }
                this.creator.createGrid(grid);
                this.setState(GameStateEnum.PREPARE);
                break;
            case GameStateEnum.PREPARE:
                this.setState(GameStateEnum.CLICK_WAIT);
                break;
            case GameStateEnum.CLICK_WAIT:
                if (!this.tiles?.head) {
                    this.setState(GameStateEnum.GAME_OVER);
                    return;
                }
                const arr: TileSelectedNode[] = [];
                for (let node = this.selectedTiles?.head; node; node = node.next) {
                    arr.push(node);
                }

                if (arr.length > 1) {
                    this.setState(GameStateEnum.ANIMATION);
                    this.handleClick(arr).then(() => {
                        this.setState(GameStateEnum.TIMEOUT);
                    });
                }
                break;
            case GameStateEnum.ANIMATION:
                break;
            case GameStateEnum.TIMEOUT:
                if (this.game.head.game.stateTime > 0.001) {
                    this.setState(GameStateEnum.CLICK_WAIT);
                }
                break;
            case GameStateEnum.GAME_OVER:
                break;
        }
    };

    private setState(state: GameStateEnum) {
        if (this.game?.head) {
            this.game.head.game.stateTime = 0;
            this.game.head.game.state = state;
        }
    }

    private async handleClick(tiles: TileSelectedNode[]) {
        await new TimeSkipper(100).execute();

        const tileA = tiles[0];
        const tileB = tiles[1];

        const arr = await this.gameLogic.findCross(tileA.gridPosition, tileB.gridPosition);

        if (arr.length > 0 && tileA.icon.state.key === tileB.icon.state.key) {
            tiles.forEach((node) => {
                this.creator.removeEntity(node.entity);
            });
        } else {
            tiles.forEach((node) => {
                this.creator.selectTile(node.tile, false);
            });
        }
    }
}
