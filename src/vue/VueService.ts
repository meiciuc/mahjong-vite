import { createApp } from 'vue';
import App from './App.vue';
import { Signal0 } from '@ash.ts/ash';

class VueService {

    signalHelpButton = new Signal0();

    init () {
        createApp(App).mount(document.body.appendChild(document.createElement('div')));
    }

}
export const vueService = new VueService();