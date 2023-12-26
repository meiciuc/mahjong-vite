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

export class GameLogic {
    private grid: NodeList<GridNode>;
    private tiles: NodeList<TileNode>;
    private iconsQueue: number[] = [];

    constructor(engine: Engine) {
        this.grid = engine.getNodeList(GridNode);
        this.tiles = engine.getNodeList(TileNode);
    }

    public generateIconsQueue(gridWidth: number, gridHeight: number, seed: string | undefined = undefined) {
        if (!seed) {
            seed = `${Math.random()}`
        }
        const model = dataService.getRootModel<GameModel>().data
        const gw = gridWidth;
        const gh = gridHeight;
        const currentLevel = model.gameLevel;
        const shift = 4;

        const iconsQueue = [];

        const pares = this.getGameMaxIconPaires();
        let maxc = pares * 2;
        let count = gw * gh;
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
            index = (index + 1) % model.icons.length;
            maxc = pares * 2;
        }

        shuffle(iconsQueue, seed);

        this.iconsQueue = iconsQueue;
    }

    public async needHelp() {
        const paires: { [key: string]: boolean } = {};

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
                    return result;
                }

                paires[nodeAId + '_' + nodeBId] = true;
            }
        }

        return [];
    }

    public getIcon(index: number) {
        return this.iconsQueue[index];
    }

    public async findCross(A: PointLike, B: PointLike) {
        // create matrix
        const grid = throwIfNull(this.grid.head).grid.current;
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

    private getGameMaxIconPaires() {
        const model = dataService.getRootModel<GameModel>();
        const easing = easingsFunctions.easeOutQuad;

        const startA = 3;
        const endA = 3;

        const currentLevel = model ? model.data.gameLevel : 1;
        const scaleLevel = currentLevel / Config.MAX_GAME_LEVEL;

        const currentA = Math.round(easing(scaleLevel) * (endA - startA) + startA);

        return currentA;
    }
}
