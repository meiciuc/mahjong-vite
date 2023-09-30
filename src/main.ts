import TWEEN from '@tweenjs/tween.js';
import { Application } from 'pixi.js';
import Stats from 'stats.js';
import { Config } from './Config';
import { LAYERS } from './GameLayers';
import { ApplicationController } from './controllers/ApplicationController';
import { stageService } from './core/services/StageService';
import './style.css';

import { PreloaderController } from './controllers/PreloaderController';
import { GameModelHelper } from './model/GameModelHelper';
import { vueService } from './vue/VueService';
import { AssetsController } from './controllers/AssetsController';

const app = new Application({
    backgroundColor: Config.APPLICATION_BACKGROUND_COLOR,
    resolution: window.devicePixelRatio,
});
app.renderer.plugins.interaction.autoPreventDefault = true;

window.onload = async (): Promise<void> => {
    await initStageService();

    if (Config.DEV_USE_PRELOADER) {
        const assetsController = new AssetsController();
        assetsController.execute();
        const preloader = await new PreloaderController(assetsController.signal).execute();
        preloader.destroy();
        assetsController.destroy();
    } else {
        const assetsController = new AssetsController();
        await assetsController.execute();
        assetsController.destroy();
    }

    document.body.appendChild(app.view as unknown as Node);

    GameModelHelper.createModel();
    vueService.init();

    setupTweens();

    // start application
    new ApplicationController().execute();
    app.stage.interactive = true;

    if (Config.DEV_SHOW_STATS) {
        addStats();
    }
};



function setupTweens() {
    const animate = function (time: number) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    };
    requestAnimationFrame(animate);
}

function addStats() {
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.begin();
    document.body.appendChild(stats.dom);
    stats.dom.style.top = '';
    stats.dom.style.bottom = '0px';
    stats.dom.style.left = '100px';
    stats.dom.style.marginLeft = `-${stats.dom.getBoundingClientRect().width / 2}px`;

    const animate = function () {
        requestAnimationFrame(animate);
        stats.update();
    };
    requestAnimationFrame(animate);
}

async function initStageService() {
    stageService.config({
        layers: [LAYERS.BACKGROUND, LAYERS.GAME, LAYERS.EFFECTS],
        layerDefault: LAYERS.GAME,
    });
    await stageService.init(app);
}