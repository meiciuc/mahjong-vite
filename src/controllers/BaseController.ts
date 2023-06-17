import { BaseCommand } from '../utils/BaseCommand';

export class BaseController extends BaseCommand {
    destroy() {
        console.log('destroy');
    }
}
