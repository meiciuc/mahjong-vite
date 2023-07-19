import { Engine, NodeList } from '@ash.ts/ash';
import { throwIfNull } from '../../utils/throwIfNull';
import { CrossFinder } from '../../controllers/finder/CrossFinder';
import { PointLike } from '../../utils/point';
import { shuffle } from '../../utils/utils';
import { GridNode } from '../tiles/nodes/GridNode';
import { TileNode } from '../tiles/nodes/TileNode';
import { dataService } from '../../core/services/DataService';
import { GameModel } from '../../model/GameModel';

export class GameLogic {
    private grid: NodeList<GridNode>;
    private tiles: NodeList<TileNode>;
    private iconsQueue: number[] = [];

    constructor(engine: Engine) {
        this.grid = engine.getNodeList(GridNode);
        this.tiles = engine.getNodeList(TileNode);
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
        return this.getQueue()[index];
    }

    public getQueue() {
        if (this.iconsQueue.length === 0) {
            this.generateIconsQueue();
        }
        return this.iconsQueue;
    }

    public async findCross(A: PointLike, B: PointLike) {
        // create matrix
        const grid = throwIfNull(this.grid.head).grid.grid;
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
                return Promise.resolve([]);
            });
    }

    // TODO переделать или вообще вынести из логики? лучше всё сюда занести, конечно
    private generateIconsQueue() {
        this.iconsQueue = [];

        const types = 10;
        let index = 0;
        const paires = dataService.getRootModel<GameModel>().data.assetsIconsNumber;
        for (let i = 0; i < paires; i++) {
            this.iconsQueue.push(index);
            this.iconsQueue.push(index);
            index++;
            if (index > types) {
                index = 0;
            }
        }

        shuffle(this.iconsQueue, 'hello.');
    }
}
