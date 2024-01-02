import { createApp } from 'vue';
import App from './App.vue';
import { Signal } from '../core/utils/signal';

class VueService {
    signalStartButton = new Signal()
    signalHelpButton = new Signal();
    signalPauseButton = new Signal();
    signalGameEndButton = new Signal();
    signalOptionsButton = new Signal();
    signalOptionsResetLevels = new Signal();

    init() {
        createApp(App).mount(document.body.appendChild(document.createElement('div')));
    }

    getCanvasParent() {
        return document.body.querySelector('#canvas');
    }
}
export const vueService = new VueService();