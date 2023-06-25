// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'

// createApp(App).mount('#app')
import TWEEN from '@tweenjs/tween.js';
import { Application, Assets } from 'pixi.js';
import Stats from 'stats.js';
import { LAYERS } from './GameLayers';
import { ApplicationController } from './controllers/ApplicationController';
import { stageService } from './core/services/StageService';
import './style.css';
import { Config } from './Config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const WebFont = require('webfontloader');
import WebFont from 'webfontloader';
import { vueService } from './vue/VueService';

const app = new Application({
    backgroundColor: Config.APPLICATION_BACKGROUND_COLOR,
    resizeTo: window,
    resolution: window.devicePixelRatio,
    autoDensity: true,
});
app.renderer.plugins.interaction.autoPreventDefault = true;

window.onload = async (): Promise<void> => {
    await loadFonts();
    await loadGameAssets();
    document.body.appendChild(app.view as unknown as Node);

    stageService.config({
        layers: [LAYERS.BACKGROUND, LAYERS.GAME, LAYERS.EFFECTS],
        layerDefault: LAYERS.GAME,
    });
    await stageService.init(app);
    vueService.init();

    new ApplicationController().execute();

    app.stage.interactive = true;

    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.begin();
    document.body.appendChild(stats.dom);
    stats.dom.style.top = '';
    stats.dom.style.bottom = '0px';
    stats.dom.style.left = '100px';
    stats.dom.style.marginLeft = `-${stats.dom.getBoundingClientRect().width / 2}px`;

    // TODO
    const animate = function (time: number) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
        stats.update();
    };
    requestAnimationFrame(animate);
};

async function loadFonts() {
    return new Promise((resolve) => {
        WebFont.load({
            custom: {
                families: ['Untitled-1'],
            },
            timeout: 1000,
            active: () => {
                console.log('active');
                resolve(true);
            },
        });
    })
        .catch((error: Error) => {
            console.log('Error: ', error);
        })
        .finally(() => {
            return Promise.resolve(true);
        });
}

async function loadGameAssets() {
    await Assets.load([`./assets/${Config.ASSETST_ICONS_VERSION}/icons_atlas.json`]);
}