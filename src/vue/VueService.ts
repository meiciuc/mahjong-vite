import { createApp } from 'vue';
import App from './App.vue';
import { Signal } from '../core/utils/signal';

export enum VueServiceSignals {
    StartButton = 'StartButton',
    GameEndButton = 'GameEndButton',
    OptionsButton = 'OptionsButton',
    OptionsResetLevels = 'OptionsResetLevels',

    LeaderBoardButton = 'LeaderBoardButton',
    TutorialButton = 'TutorialButton',
    LeaveTutorial = 'LeaveTutorial',

    BoosterTimeClick = 'BoosterTimeClick',
    BoosterHelpClick = 'BoosterHelpClick',

    OpenShop = 'OpenShop',
    ShareShow = 'ShareShow',
    InviteShow = 'InviteShow',
}

export enum VueShopSignals {
    ProposalPurchased = 'BoosterPurchased',
}

class VueService {
    signalDataBus = new Signal<VueServiceSignals>();
    shopDataBus = new Signal<VueShopSignals, string>();

    init() {
        createApp(App).mount(document.body.appendChild(document.createElement('div')));
    }

    getCanvasParent() {
        return document.body.querySelector('#canvas');
    }
}
export const vueService = new VueService();