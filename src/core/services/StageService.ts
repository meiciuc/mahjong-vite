import { FrameTickProvider, Signal1, Signal3 } from '@ash.ts/ash';
import { debounce } from 'lodash';
import { Application, Container } from 'pixi.js';
import { Config } from '../../Config';

export interface RootConfig {
    gameTitle?: string;
    layers: number[];
    layerDefault: number;
}

class StageService {
    private readonly layers = new Map<number, Container>();

    private cfg: RootConfig | undefined;
    private layerDefault = 0;

    public config(config: RootConfig) {
        this.cfg = config;
        this.layerDefault = this.cfg.layerDefault;
    }

    private app?: Application;
    private root?: Container;

    public readonly resizeSignal = new Signal3<number, number, number>(); // width, height, dpr
    public readonly updateSignal = new Signal1<number>();
    public scale = 1;

    public async init(app: Application) {
        const { layers, layerDefault } = this.cfg || { layers: [0], layerDefault: 0 };

        this.layerDefault = layerDefault;

        this.app = app;
        this.root = new Container();
        this.app.stage.addChild(this.root);


        layers.sort();
        for (const layer of layers) {
            this.layers.set(layer, this.root.addChild(new Container()));
        }

        this.resize();

        const tickProvider = new FrameTickProvider();
        tickProvider.add((delta: number) => this.updateSignal.dispatch(delta));
        tickProvider.start();

        window.addEventListener('resize', this.resize);
        window.addEventListener('orientationchange', debounce(this.handleOrientation, 100), true);

        return Promise.resolve(this);
    }

    private handleOrientation = () => {
        this.resize();
    };

    private resize = () => {
        if (!this.app) {
            return;
        }

        // TODO refactoring
        const menuPadding = 60

        const appWidth = window.innerWidth;
        const appHeight = window.innerHeight - menuPadding;

        if (this.app.view.width === appWidth && this.app.view.height === appHeight) {
            return;
        }

        this.app.view.width = appWidth;
        this.app.view.height = appHeight;
        const canvas = (this.app.view as HTMLCanvasElement);
        canvas.style.position = 'absolute';
        canvas.style.top = `${menuPadding}px`;
        canvas.style.width = `${appWidth}px`;
        canvas.style.height = `${appHeight}px`;

        const sideMax = Math.max(Config.GAME_WIDTH_DEFAULT, Config.GAME_HEIGHT_DEFAULT);
        const scaleH = appWidth / sideMax;
        const scaleV = appHeight / sideMax;
        Config.GAME_WIDTH = sideMax * scaleH;
        Config.GAME_HEIGHT = sideMax * scaleV;

        this.scale = Math.min(
            appWidth / Config.GAME_WIDTH / window.devicePixelRatio,
            appHeight / Config.GAME_HEIGHT / window.devicePixelRatio,
        );
        this.root.scale.set(this.scale, this.scale);

        const RATIO = Config.GAME_WIDTH / Config.GAME_HEIGHT;
        const canvasRatio = appWidth / appHeight;

        let offsetX = 1;
        let offsetY = 1;
        if (canvasRatio > RATIO) {
            const scaleX = RATIO / canvasRatio;
            offsetX = ((1 - scaleX) * appWidth) / 2;
            offsetY = 0;
        } else {
            const scaleY = canvasRatio / RATIO;
            offsetX = 0;
            offsetY = ((1 - scaleY) * appHeight) / 2;
        }

        this.root.position.set(offsetX, offsetY);

        this.resizeSignal.dispatch(appWidth, appHeight, window.devicePixelRatio);
    };

    public getLayer(layerId: number) {
        return this.layers.get(layerId) || (this.layers.get(this.layerDefault) as Container);
    }

    public get width(): number {
        return this.app ? this.app.renderer.width : Config.GAME_WIDTH;
    }

    public get height(): number {
        return this.app ? this.app.renderer.height : Config.GAME_HEIGHT;
    }

    public get dpr(): number {
        return window.devicePixelRatio;
    }
}

export const stageService = new StageService();
