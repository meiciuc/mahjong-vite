import { createApp } from 'vue';
import App from './App.vue';
import { Signal } from '../core/utils/signal';

export enum VueServiceSignals {
    StartButton,
    HelpButton,
    PauseButton,
    GameEndButton,
    OptionsButton,
    OptionsResetLevels,
}

class VueService {
    signalDataBus = new Signal<VueServiceSignals>();

    init() {
        createApp(App).mount(document.body.appendChild(document.createElement('div')));
    }

    getCanvasParent() {
        return document.body.querySelector('#canvas');
    }
}
export const vueService = new VueService();