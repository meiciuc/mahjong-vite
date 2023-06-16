import { BaseCommand } from '../common/BaseCommand';

export class BaseController extends BaseCommand {
    destroy() {
        console.log('destroy');
    }
}
