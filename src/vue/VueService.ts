import { createApp } from 'vue';
import App from './App.vue';
import { Signal } from '../core/utils/signal';

export enum MenuPosition {
    LEFT,
    TOP
}

class VueService {

    signalStartButton = new Signal()
    signalHelpButton = new Signal();
    signalGameEndButton = new Signal();

    init() {
        createApp(App).mount(document.body.appendChild(document.createElement('div')));
    }

    get menuPosition() {
        return MenuPosition.LEFT;
    }

}
export const vueService = new VueService();