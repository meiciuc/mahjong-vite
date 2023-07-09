import { Entity } from '@ash.ts/ash';
import { Config } from '../Config';
import { BaseCommand } from '../utils/BaseCommand';
import { PointLike } from '../utils/point';
import { TimeSkipper } from '../utils/TimeSkipper';
import { EntityCreator } from '../ecs/EntityCreator';

export class VisualizePath extends BaseCommand {
    constructor(private arr: PointLike[], private creator: EntityCreator) {
        super();
    }

    protected async doExecute() {
        const entities: Entity[] = [];
        for (let i = 0; i < this.arr.length; i++) {
            entities.push(
                this.creator.showPath(
                    this.arr[i].x * Config.ICON_IMAGE_WIDTH,
                    this.arr[i].y * Config.ICON_IMAGE_HEIGHT - 25,
                ),
            );
            await new TimeSkipper(30).execute();
        }

        while (entities.length > 0) {
            this.creator.removeEntity(entities.shift()!);
            await new TimeSkipper(30).execute();
        }

        this.complete();
    }
}
