import { Container } from 'pixi.js';

export class GridView extends Container {
    public grid: Container;
    public background: Container;
    public tiles: Container;
    public effects: Container;

    constructor() {
        super();

        this.grid = new Container();
        this.addChild(this.grid);

        this.background = new Container();
        this.grid.addChild(this.background);

        this.tiles = new Container();
        this.grid.addChild(this.tiles);

        this.effects = new Container();
        this.grid.addChild(this.effects);
    }
}
