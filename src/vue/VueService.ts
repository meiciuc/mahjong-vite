import { createApp } from 'vue';
import App from './App.vue';
import { Signal } from '../core/utils/signal';

export enum VueServiceSignals {
    StartButton = 'StartButton',
    GameEndButton = 'GameEndButton',
    OptionsButton = 'OptionsButton',
    OptionsResetLevels = 'OptionsResetLevels',

    LeaderBoardButton = 'LeaderBoardButton',
    LeaderBoardYesterdayButton = 'LeaderBoardYesterdayButton',
    LeaderBoardTodayButton = 'LeaderBoardTodayButton',
    LeaderBoardAlwaysButton = 'LeaderBoardAlwaysButton',

    RetryButton = 'RetryButton',

    TutorialButton = 'TutorialButton',
    LeaveTutorial = 'LeaveTutorial',

    BoosterTimeClick = 'BoosterTimeClick',
    BoosterHelpClick = 'BoosterHelpClick',

    OpenShop = 'OpenShop',
    ShareShow = 'ShareShow',
    InviteShow = 'InviteShow',

    ProposalPurchased = 'BoosterPurchased',
}

export interface EmptyData {

}

export interface ShopData extends EmptyData {
    id: string,
}

export type AnyBusData = EmptyData | ShopData;

class VueService {
    signalDataBus = new Signal<VueServiceSignals, AnyBusData>();

    init() {
        createApp(App).mount(document.body.appendChild(document.createElement('div')));
    }

    getCanvasParent() {
        return document.body.querySelector('#canvas');
    }
}
export const vueService = new VueService();