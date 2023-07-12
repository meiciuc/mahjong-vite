import { Config } from '../Config';
import { dataService } from '../core/services/DataService';
import { GameModel } from '../model/GameModel';
import { BaseCommand } from '../utils/BaseCommand';

export class PrepareIconsCommand extends BaseCommand {
    protected async doExecute() {
        const namePart = 'icons/image_part_';
        const length = Config.ASSETS_ICONS_NUMBER;

        const icons = dataService.getRootModel<GameModel>().data.icons
        icons.splice(0);
        for (let i = 0; i < length; i++) {
            const part = i + 1;
            icons.push({
                key: `${namePart}${part < 100 ? '0' : ''}${part < 10 ? '0' : ''}${part}`,
            });
        }
        this.complete();
    }
}
