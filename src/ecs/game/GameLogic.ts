import { Engine, NodeList } from '@ash.ts/ash';
import { Config } from '../../Config';
import { CrossFinder } from '../../controllers/finder/CrossFinder';
import { dataService } from '../../core/services/DataService';
import { stageService } from '../../core/services/StageService';
import easingsFunctions from '../../core/utils/easingsFunctions';
import { GameModel } from '../../model/GameModel';
import { PointLike } from '../../utils/point';
import { throwIfNull } from '../../utils/throwIfNull';
import { shuffle } from '../../utils/utils';
import { GridNode } from '../tiles/nodes/GridNode';
import { TileNode } from '../tiles/nodes/TileNode';

export interface GenerateIconsParams {

}

export class GameLogic {
    private grid: NodeList<GridNode>;
    private tiles: NodeList<TileNode>;
    private iconsQueue: number[] = [];

    constructor(engine: Engine) {
        this.grid = engine.getNodeList(GridNode);
        this.tiles = engine.getNodeList(TileNode);
    }

    public getDefaultGenerateIconsConfig() {
        const model = dataService.getRootModel<GameModel>().data;
        const { gridWidth, gridHeight, seed } = model;
        return {
            gridWidth,
            gridHeight,
            seed: seed ? seed : `${Math.random()}`,
            pares: this.getGameMaxIconPaires(),
            currentLevel: model.level,
            iconsLength: model.icons.length,
        };
    }

    public generateIconsQueue(config = this.getDefaultGenerateIconsConfig()) {
        const { gridWidth, gridHeight, seed, pares, currentLevel, iconsLength } = config;

        const shift = 4;

        const iconsQueue = [];

        let maxc = pares * 2;
        let count = gridWidth * gridHeight;
        let index = currentLevel < shift ? 0 : currentLevel - shift;
        index = index >= iconsLength ? 0 : index;
        while (count > 0) {
            while (maxc > 0) {
                iconsQueue.push(index);
                maxc--;
                count--;
                if (count <= 0) {
                    break;
                }
            }
            index = (index + 1) % iconsLength;
            index = index >= iconsLength ? 0 : index;
            maxc = pares * 2;
        }

        shuffle(iconsQueue, seed);
        this.iconsQueue = iconsQueue;
    }

    public async needHelp(random = Config.DEV_HELP_LOGIC_IS_RANDOM) {
        const paires: { [key: string]: boolean } = {};
        const results: PointLike[][] = [];

        for (let nodeA = this.tiles.head; nodeA; nodeA = nodeA.next) {
            const nodeAId = '' + nodeA.tile.id;
            for (let nodeB = this.tiles.head; nodeB; nodeB = nodeB.next) {
                const nodeBId = '' + nodeB.tile.id;

                if (
                    paires[nodeBId + '_' + nodeAId] ||
                    nodeA === nodeB ||
                    nodeA.icon.state.key !== nodeB.icon.state.key
                ) {
                    continue;
                }

                const result = await this.findCross(nodeA.gridPosition, nodeB.gridPosition);
                if (result.length) {
                    if (random) {
                        results.push(result);
                    } else {
                        return result;
                    }
                }

                paires[nodeAId + '_' + nodeBId] = true;
            }
        }

        if (Config.DEV_GET_SHORTEST_PATH_HELP_RESULT) {
            results.sort((a, b) => a.length - b.length);
            return results.length > 0 ? results[0] : [];
        }

        if (Config.DEV_GET_LONGEST_PATH_HELP_RESULT) {
            results.sort((a, b) => b.length - a.length);
            return results.length > 0 ? results[0] : [];
        }

        return results.length > 0 ? shuffle(results)[0] : [];
    }

    public getIcon(index: number) {
        return this.iconsQueue[index];
    }

    public async findCross(A: PointLike, B: PointLike) {
        const grid = throwIfNull(this.grid.head).grid.current;
        return GameLogic.findCross(grid, A, B);
    }

    private getGameMaxIconPaires() {
        const model = dataService.getRootModel<GameModel>();
        const easing = easingsFunctions.linear;

        const currentLevel = model ? model.data.level : 1;
        const scaleLevel = currentLevel / Config.MAX_GAME_LEVEL;

        const startA = 2;
        const endA = 20;

        // const scale2 = 4 / 136;
        // const count = model.data.gridWidth * model.data.gridHeight;
        // const currentA = scale2 * count;

        const currentA = Math.round(easing(scaleLevel) * (endA - startA) + startA);
        return currentA;
    }

    static async findCross(grid: number[][], A: PointLike, B: PointLike) {
        // create matrix
        const aMatrix: number[][] = [];
        for (let i = 0; i < grid.length; i++) {
            aMatrix.push([]);
            for (let j = 0; j < grid[i].length; j++) {
                if ((j === A.x && i === A.y) || (j === B.x && i === B.y)) {
                    aMatrix[i].push(0);
                } else {
                    aMatrix[i].push(grid[i][j] === -1 ? 0 : 1);
                }
            }
        }

        return new CrossFinder(aMatrix, A, B)
            .execute()
            .then((cross) => {
                return Promise.resolve(cross.result);
            })
            .catch(() => {
                const result: PointLike[] = [];
                return Promise.resolve(result);
            });
    }

    static calculateGameModelParams(level: number) {
        const start = 5;    // 9
        const end = Math.floor(Config.MAX_GAME_LEVEL / 2);

        const currentLevel = level;
        const scaleLevel = currentLevel / Config.MAX_GAME_LEVEL;

        const size = Math.floor(scaleLevel * (end - start) + start);
        const commonCount = size + size;
        const scale = stageService.height / (stageService.width + stageService.height);

        let gridHeight = Math.floor(commonCount * scale);
        const gridWidth = Math.round(commonCount - gridHeight);

        if (gridHeight % 2 !== 0 && gridWidth % 2 !== 0) {
            gridHeight++;
        }

        const seed = `${Math.random()}`;
        const kLevel = (10 - currentLevel % 5) / 10;
        const gameMaxTime = Math.max(Config.MIN_TIME_PER_GAME, Math.round(size * size * Config.TIME_FACTOR_PER_TURN * kLevel));

        return { level, gridWidth, gridHeight, seed, gameMaxTime };
    }
}
