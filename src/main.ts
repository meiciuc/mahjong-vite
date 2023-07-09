import TWEEN from '@tweenjs/tween.js';
import { Application, Assets } from 'pixi.js';
import Stats from 'stats.js';
import { LAYERS } from './GameLayers';
import { ApplicationController } from './controllers/ApplicationController';
import { stageService } from './core/services/StageService';
import './style.css';
import { Config } from './Config';

import WebFont from 'webfontloader';
import { vueService } from './vue/VueService';
import { dataService } from './core/services/DataService';
import { AppStateEnum, GameStateEnum, GameModel } from './model/GameModel';

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
    
    createModel();
    await initStageService();
    vueService.init();
    
    setupTweens();
    addStats();

    // start application
    new ApplicationController().execute();
    app.stage.interactive = true;
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
    await Assets.load([`./assets/particle.png`]);
}

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

function createModel() {
    dataService.config<GameModel>({
        icons: [],
        appState: AppStateEnum.NONE,
        appStateTime: 0,
        gameState: GameStateEnum.NONE,
        gameStateTime: 0,
        helpsCount: 3,
    });
}