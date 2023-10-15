import { FrameTickProvider, Signal1, Signal3 } from '@ash.ts/ash';
import { Application, Container } from 'pixi.js';

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

    // width, height, dpr
    public readonly resizeSignal = new Signal3<number, number, number>();
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
        window.addEventListener('orientationchange', this.handleOrientation);

        return Promise.resolve(this);
    }

    private handleOrientation = () => {
        this.resize();
    };

    // TODO window.devicePixelRatio
    private resize = () => {
        if (!this.app) {
            return;
        }

        const parent = this.app.view.parentNode as HTMLHtmlElement;
        this.app.renderer.resize(parent.clientWidth, parent.clientHeight);

        const appWidth = this.app.screen.width;
        const appHeight = this.app.screen.height;

        this.resizeSignal.dispatch(appWidth, appHeight, window.devicePixelRatio);
    };

    public getLayer(layerId: number) {
        return this.layers.get(layerId) || (this.layers.get(this.layerDefault) as Container);
    }

    public get width(): number {
        return this.app.screen.width;
    }

    public get height(): number {
        return this.app.screen.height;
    }

    public get dpr(): number {
        return window.devicePixelRatio;
    }
}

export const stageService = new StageService();
