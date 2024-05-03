import { Engine, NodeList } from '@ash.ts/ash';
import { CrossFinder } from '../../controllers/finder/CrossFinder';
import { PointLike } from '../../utils/point';
import { throwIfNull } from '../../utils/throwIfNull';
import { GridNode } from '../tiles/nodes/GridNode';
import { TileNode } from '../tiles/nodes/TileNode';
import { dataService } from '../../core/services/DataService';
import { GameModel } from '../../model/GameModel';
import { shuffle } from '../../utils/utils';
import easingsFunctions from '../../core/utils/easingsFunctions';
import { Config } from '../../Config';
import { stageService } from '../../core/services/StageService';

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

    public seticonsQueue(value: number[]) {
        this.iconsQueue.splice(0);
        for (const item of value) {
            this.iconsQueue.push(item);
        }
    }

    public getDefaultGenerateIconsConfig() {
        const model = dataService.getRootModel<GameModel>().data;
        const { gridWidth, gridHeight, seed } = model;
        return {
            gridWidth,
            gridHeight,
            seed: seed ? seed : `${Math.random()}`,
            pares: this.getGameMaxIconPaires(),
            currentLevel: model.gameLevel,
            iconsLength: model.icons.length,
        };
    }

    public generateIconsQueue(config = this.getDefaultGenerateIconsConfig()) {
        const { gridWidth, gridHeight, seed, pares, currentLevel, iconsLength } = config;

        console.log('gridWidth', gridWidth, gridHeight)

        const shift = 4;

        const iconsQueue = [];

        let maxc = pares * 2;
        let count = gridWidth * gridHeight;
        let index = currentLevel < shift ? 0 : currentLevel - shift;
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
            maxc = pares * 2;
        }

        shuffle(iconsQueue, seed);
        console.log('iconsQueue', iconsQueue)
        this.iconsQueue = iconsQueue;
    }

    public async needHelp(random = true) {
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

        const startA = 2;
        const endA = 20;

        const currentLevel = model ? model.data.gameLevel : 1;
        const scaleLevel = currentLevel / Config.MAX_GAME_LEVEL;

        const currentA = Math.round(easing(scaleLevel) * (endA - startA) + startA);
        console.log('getGameMaxIconPaires', currentA)
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

    static calculateGameModelParams(gameLevel: number) {
        const easing = easingsFunctions.easeOutQuad;

        const start = 5;    // 9
        const end = 45;//15;     // 23

        const currentLevel = gameLevel;
        const scaleLevel = currentLevel / Config.MAX_GAME_LEVEL;

        const size = Math.floor(easing(scaleLevel) * (end - start) + start);
        const commonCount = size + size;
        const scale = stageService.height / (stageService.width + stageService.height);

        let gridHeight = Math.floor(commonCount * scale);
        const gridWidth = Math.round(commonCount - gridHeight);

        if (gridHeight % 2 !== 0 && gridWidth % 2 !== 0) {
            gridHeight++;
        }

        const seed = `${Math.random()}`;
        const kLevel = (10 - currentLevel % 5) / 10;
        const gameMaxTime = Math.round(Math.max(size * size * 2, 60) * kLevel);

        return { gameLevel, gridWidth, gridHeight, seed, gameMaxTime };
    }
}
