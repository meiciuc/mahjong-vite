import { Engine, NodeList, System } from '@ash.ts/ash';
import { throwIfNull } from '../../utils/throwIfNull';
import { Config } from '../../Config';
import { TimeSkipper } from '../../utils/TimeSkipper';
import { EntityCreator } from '../EntityCreator';
import { TileNode } from '../tiles/nodes/TileNode';
import { TileSelectedNode } from '../tiles/nodes/TileSelectedNode';
import { GameLogic } from './GameLogic';
import { GameNode } from './nodes/GameNode';
import { GameModel, GameStateEnum } from '../../model/GameModel';
import { GameModelHelper } from '../../model/GameModelHelper';
import { dataService } from '../../core/services/DataService';
import { rotate270 } from "2d-array-rotation";
import { stageService } from '../../core/services/StageService';
import { GridNode } from '../tiles/nodes/GridNode';
import { GridPosition } from '../tiles/components/GridPosition';

export class GameSystem extends System {
    private game?: NodeList<GameNode>;
    private selectedTiles?: NodeList<TileSelectedNode>;
    private tiles?: NodeList<TileNode>;
    private grid?: NodeList<GridNode>;
    private gameModel?: GameModel;

    private portrait: number[][];
    private landscape: number[][];

    constructor(private creator: EntityCreator, private gameLogic: GameLogic) {
        super();
    }

    addToEngine(engine: Engine): void {
        this.gameModel = dataService.getRootModel<GameModel>().data;
        this.tiles = engine.getNodeList(TileNode);
        this.selectedTiles = engine.getNodeList(TileSelectedNode);
        this.game = engine.getNodeList(GameNode);
        this.grid = engine.getNodeList(GridNode);
        this.creator.createGame();

        stageService.resizeSignal.add(this.handleResize);
    }

    removeFromEngine(_engine: Engine): void { }

    update = (): void => {
        if (!this.game?.head) {
            return;
        }

        switch (this.game.head.game.model.data.gameState) {
            case GameStateEnum.NONE:
                let index = 0;
                const grid: number[][] = [];
                for (let y = 0; y < this.gameModel.gridHeight + 2; y++) {
                    const row = grid[grid.push([]) - 1];
                    for (let x = 0; x < this.gameModel.gridWidth + 2; x++) {
                        if (y === 0 || x === 0 || y === this.gameModel.gridHeight + 1 || x === this.gameModel.gridWidth + 1) {
                            // empty grid border for a-star
                            row.push(Config.GRID_EMPTY_VALUE);
                            continue;
                        }

                        this.creator.createTile(this.gameLogic.getIcon(index), x, y);
                        row.push(throwIfNull(this.tiles?.tail).tile.id);

                        index++;
                    }
                }

                // rotation
                const newGrid = rotate270(grid);
                this.portrait = grid.length > newGrid.length ? grid : newGrid;
                this.landscape = this.portrait === grid ? newGrid : grid;

                // create grid
                this.creator.createGrid(grid, this.portrait, this.landscape);

                // set game state
                this.setState(GameStateEnum.PREPARE);
                break;
            case GameStateEnum.PREPARE:
                this.setState(GameStateEnum.CLICK_WAIT);
                break;
            case GameStateEnum.CLICK_WAIT:
                if (!this.tiles?.head) {
                    this.setState(GameStateEnum.GAME_VICTORY);
                    return;
                }

                if (this.game.head.game.model.data.gameStateTime >= this.game.head.game.model.data.gameMaxTime) {
                    this.game.head.game.model.data.gameState = GameStateEnum.GAME_DEFEATE;
                }

                const arr: TileSelectedNode[] = [];
                for (let node = this.selectedTiles?.head; node; node = node.next) {
                    arr.push(node);
                }

                if (arr.length > 1) {
                    this.handleTwoSelected(arr);
                }
                break;
        }
    };

    private async setState(state: GameStateEnum) {
        if (!this.game?.head) {
            return;
        }

        if (state === GameStateEnum.CLICK_WAIT) {
            const arr = await this.gameLogic.needHelp();
            if (arr.length === 0) {
                GameModelHelper.setGameState(GameStateEnum.GAME_NO_MORE_MOVES)
                return;
            }
        }

        this.game.head.game.model.data.gameState = state;
    }

    private async handleTwoSelected(tiles: TileSelectedNode[]) {
        const tileA = throwIfNull(tiles[0]);
        const tileB = throwIfNull(tiles[1]);

        const arr = await this.gameLogic.findCross(tileA.gridPosition, tileB.gridPosition);

        if (arr.length > 0 && tileA.icon.state.key === tileB.icon.state.key) {
            // true move
            GameModelHelper.setGameScore(GameModelHelper.getGameScore() + Config.ADD_SCORE_FOR_TRUE_MOVE);
            const pathEntity = this.creator.showPath(arr, Config.PATH_LIKE_SNAKE_DURATION);
            const ids: number[] = [];
            tiles.forEach((node) => {
                ids.push(node.tile.id);
                this.creator.nonInteractiveTile(node.tile);
            });
            await new TimeSkipper(Config.PATH_LIKE_SNAKE_DURATION * 1000 * 1.5).execute();
            ids.forEach((id) => {
                const node = this.creator.getTileNodeById(id);
                if (node) {
                    this.creator.removeEntity(node.entity);
                }
            });
            if (pathEntity) {
                this.creator.removeEntity(pathEntity);
            }
        } else {
            // wrong move
            GameModelHelper.setGameScore(Math.max(0, GameModelHelper.getGameScore() + Config.ADD_SCORE_FOR_FALSE_MOVE));
            this.creator.shakeTile(tileA.tile, true);
            this.creator.selectTile(tileA.tile, false);
            this.creator.selectTile(tileB.tile, false);
        }
    }

    private handleResize = () => {
        const grid = this.grid.head.grid.current;
        if (!grid) {
            return;
        }

        if (this.portrait === this.landscape) {
            return;
        }

        const appPortrait = stageService.width < stageService.height;
        const gridPortrait = grid.length > grid[0].length;
        if (appPortrait === gridPortrait) {
            return;
        }

        // update grid orientation
        this.creator.createGrid(appPortrait ? this.portrait : this.landscape, this.portrait, this.landscape);

        // update tiles position
        const current = appPortrait ? this.portrait : this.landscape;
        for (let y = 0; y < current.length; y++) {
            for (let x = 0; x < current[y].length; x++) {
                const tile = this.creator.getTileNodeById(current[y][x]);
                if (!tile) {
                    continue;
                }
                tile.entity.add(new GridPosition(x, y));
            }
        }
    }
}
