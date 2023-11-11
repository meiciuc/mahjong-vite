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

window.onload = async (): Promise<void> => {
    await initAssets();
    initModel();
    initVueService();
    await initStageService();
    setupTweens();
    initDebug();

    // start application
    new ApplicationController().execute();
};

function setupTweens() {
    const animate = function (time: number) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    };
    requestAnimationFrame(animate);
}

function initDebug() {
    if (Config.DEV_SHOW_STATS) {
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
}

async function initAssets() {
    if (Config.DEV_USE_PRELOADER) {
        const assetsController = new AssetsController();
        const preloader = new PreloaderController(assetsController.signal);

        await Promise.race([preloader.execute(), assetsController.execute()])

        preloader.destroy();
        assetsController.destroy();
    } else {
        const assetsController = new AssetsController();
        await assetsController.execute();
        assetsController.destroy();
    }
}

function initModel() {
    GameModelHelper.createModel();
}

function initVueService() {
    vueService.init();
}

async function initStageService() {
    const parent = vueService.getCanvasParent() as HTMLElement;
    const app = new Application({
        backgroundColor: Config.APPLICATION_BACKGROUND_COLOR,
        resizeTo: parent,
        resolution: window.devicePixelRatio,
        autoDensity: true,
    });
    app.renderer.plugins.interaction.autoPreventDefault = true;
    app.stage.interactive = true;

    parent.appendChild(app.view as unknown as Node);

    stageService.config({
        layers: [LAYERS.BACKGROUND, LAYERS.GAME, LAYERS.TUTORIAL],
        layerDefault: LAYERS.GAME,
    });
    await stageService.init(app);
}