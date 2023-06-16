import { Config } from '../Config';
import { getGameState } from '../states/GameState';
import { BaseController } from './BaseController';

export class PrepareIconsController extends BaseController {
    protected async doExecute() {
        const namePart = 'icons/image_part_';
        const length = Config.ASSETST_ICONS_NUMBER;

        const gameState = getGameState();
        gameState.icons.splice(0);
        for (let i = 0; i < length; i++) {
            const part = i + 1;
            gameState.icons.push({
                key: `${namePart}${part < 100 ? '0' : ''}${part < 10 ? '0' : ''}${part}`,
            });
        }
        this.complete();
    }
}
