import { BaseController } from './BaseController';
import { GameController } from './GameController';
import { BackgroundController } from './BackgroundController';
import { PrepareIconsController } from './PrepareIconsController';

export class ApplicationController extends BaseController {
    protected async doExecute() {
        new BackgroundController().execute();
        const prepare = await new PrepareIconsController().execute();
        prepare.destroy();
        await this.nextCicle();
    }

    private async nextCicle() {
        const game = await new GameController().execute();
        game.destroy();

        setTimeout(() => {
            this.nextCicle();
        }, 1000);
    }
}
