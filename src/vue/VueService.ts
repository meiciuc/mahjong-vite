import { createApp } from 'vue';
import App from './App.vue';
import { Signal } from '../core/utils/signal';

export enum VueServiceSignals {
    StartButton = 'StartButton',
    HelpButton = 'HelpButton',
    PauseButton = 'PauseButton',
    GameEndButton = 'GameEndButton',
    OptionsButton = 'OptionsButton',
    OptionsResetLevels = 'OptionsResetLevels',
    BoosterTimeUseBooster = 'BoosterTimeUseBooster',
    BoosterTimeSpendScore = 'BoosterTimeSpendScore',
    BoosterTimeWatchReward = 'BoosterTimeWatchReward',
    BoosterHelpUseBooster = 'BoosterHelpUseBooster',
    BoosterHelpSpendScore = 'BoosterHelpSpendScore',
    BoosterHelpWatchReward = 'BoosterHelpWatchReward',
    ShareShow = 'ShareShow',
    InviteShow = 'InviteShow',
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