import { createApp } from 'vue';
import App from './App.vue';
import { Signal } from '../core/utils/signal';

class VueService {

    signalStartButton = new Signal()
    signalHelpButton = new Signal();

    init () {
        createApp(App).mount(document.body.appendChild(document.createElement('div')));
    }

}
export const vueService = new VueService();