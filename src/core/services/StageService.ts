import { FrameTickProvider, Signal1, Signal3 } from '@ash.ts/ash';
import { debounce, throttle } from 'lodash';
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

        window.addEventListener('resize', throttle(this.resize, 50));
        window.addEventListener('deviceorientation', debounce(this.handleOrientation, 100), true);

        return Promise.resolve(this);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private handleOrientation = (event: any) => {
        console.log('handleOrientation', event);
        this.resize();
    };

    private resize = () => {
        if (!this.app) {
            return;
        }

        const sideMax = Math.max(Config.GAME_WIDTH_DEFAULT, Config.GAME_HEIGHT_DEFAULT);
        const scaleH = this.app.view.width / sideMax;
        const scaleV = this.app.view.height / sideMax;
        Config.GAME_WIDTH = sideMax * scaleH;
        Config.GAME_HEIGHT = sideMax * scaleV;

        this.scale = Math.min(
            this.app.view.width / Config.GAME_WIDTH / window.devicePixelRatio,
            this.app.view.height / Config.GAME_HEIGHT / window.devicePixelRatio,
        );
        this.root.scale.set(this.scale, this.scale);

        const RATIO = Config.GAME_WIDTH / Config.GAME_HEIGHT;
        const canvasRatio = this.app.view.width / this.app.view.height;

        let offsetX = 1;
        let offsetY = 1;
        if (canvasRatio > RATIO) {
            const scaleX = RATIO / canvasRatio;
            offsetX = ((1 - scaleX) * window.innerWidth) / 2;
            offsetY = 0;
        } else {
            const scaleY = canvasRatio / RATIO;
            offsetX = 0;
            offsetY = ((1 - scaleY) * window.innerHeight) / 2;
        }

        this.root.position.set(offsetX, offsetY);

        this.resizeSignal.dispatch(this.app.view.width, this.app.view.height, window.devicePixelRatio);
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
