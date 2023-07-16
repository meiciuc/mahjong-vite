import { Container } from 'pixi.js';

export class GridView extends Container {
    public grid: Container;
    public background: Container;
    public effectsTilesUnder: Container;
    public tiles: Container;
    public effectsTilesAbove: Container;

    constructor() {
        super();

        this.grid = new Container();
        this.addChild(this.grid);

        this.background = new Container();
        this.grid.addChild(this.background);

        this.effectsTilesUnder = new Container();
        this.grid.addChild(this.effectsTilesUnder);

        this.tiles = new Container();
        this.grid.addChild(this.tiles);

        this.effectsTilesAbove = new Container();
        this.grid.addChild(this.effectsTilesAbove);
    }
}
