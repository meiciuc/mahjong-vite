import { BaseController } from './BaseController';
import { GameController } from './GameController';
import { BackgroundController } from './BackgroundController';
import { PrepareIconsCommand } from '../commands/PrepareIconsController';

export class ApplicationController extends BaseController {
    protected async doExecute() {
        new BackgroundController().execute();
        await new PrepareIconsCommand().execute();
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
