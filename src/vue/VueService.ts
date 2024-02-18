import { createApp } from 'vue';
import App from './App.vue';
import { Signal } from '../core/utils/signal';

export enum VueServiceSignals {
    StartButton = 'StartButton',
    GameEndButton = 'GameEndButton',
    OptionsButton = 'OptionsButton',
    OptionsResetLevels = 'OptionsResetLevels',

    BoosterTimeClick = 'BoosterTimeClick',
    BoosterHelpClick = 'BoosterHelpClick',

    BoosterTimeSpendScore = 'BoosterTimeSpendScore',
    BoosterTimeWatchReward = 'BoosterTimeWatchReward',

    BoosterHelpSpendScore = 'BoosterHelpSpendScore',
    BoosterHelpWatchReward = 'BoosterHelpWatchReward',

    OpenShop = 'OpenShop',
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