import { BaseCommand } from "../../common/BaseCommand";
import { PointLike } from "../../utils/point";

export class CrossFinder extends BaseCommand{
    private CLEAR = 0;
    public result: PointLike[] = [];

    constructor(public grid: number[][], private A: PointLike, private B: PointLike) {
        super();
    }

    private leftPoint?: PointLike;
    private rightPoint?: PointLike;

    protected async doExecute() {
        this.leftPoint = this.A.x < this.B.x ? this.A : this.B;
        this.rightPoint = this.leftPoint === this.A ? this.B : this.A;

        let shortest: PointLike[] = [];

        for (let y = 0; y < this.grid.length; y++) {
            let first = this.isYYClear(this.leftPoint.x, y, this.leftPoint.y);
            let second = this.isYYClear(this.rightPoint.x, y, this.rightPoint.y);
            let third = this.isXXClear(y, this.leftPoint.x, this.rightPoint.x);
            if (first && second && third) {
                let temp: PointLike[] = []
                temp.push({x: this.A.x, y: this.A.y});
                let length = Math.abs(this.A.y - y);
                let factor = this.A.y > y ? -1 : 1;
                for (let i = 0; i < length; i++) {
                    temp.push({x: this.A.x, y: this.A.y + i * factor});
                }
                length = Math.abs(this.A.x - this.B.x);
                factor = this.A.x < this.B.x ? 1 : -1;
                for (let i = 0; i < length; i++) {
                    temp.push({x: this.A.x + i * factor, y: y});
                }
                length = Math.abs(this.B.y - y);
                factor = this.B.y > y ? 1 : -1;
                for (let i = 0; i < length; i++) {
                    temp.push({x: this.B.x, y: y + i * factor});
                }
                temp.push({x: this.B.x, y: this.B.y});

                let res: PointLike[] = [];
                for (let i = 0; i < temp.length; i++) {
                    if (JSON.stringify(res).indexOf(JSON.stringify(temp[i])) === -1) {
                        res.push(temp[i]);
                    }
                }
                temp = res;
                shortest = shortest.length === 0 ? temp : (shortest.length > temp.length ? temp : shortest);
            }
        }

        for (let x = 0; x < this.grid[0].length; x++) {
            let first = this.isXXClear(this.leftPoint.y, x, this.leftPoint.x);
            let second = this.isXXClear(this.rightPoint.y, x, this.rightPoint.x);
            let third = this.isYYClear(x, this.leftPoint.y, this.rightPoint.y);
            if (first && second && third) {
                let temp: PointLike[] = [];
                temp.push({x: this.A.x, y: this.A.y});
                let length = Math.abs(this.A.x - x);
                let factor = this.A.x > x ? -1 : 1;
                for (let i = 0; i < length; i++) {
                    temp.push({y: this.A.y, x: this.A.x + i * factor});
                }
                length = Math.abs(this.A.y - this.B.y);
                factor = this.A.y < this.B.y ? 1 : -1;
                for (let i = 0; i < length; i++) {
                    temp.push({y: this.A.y + i * factor, x: x});
                }
                length = Math.abs(this.B.x - x);
                factor = this.B.x > x ? 1 : -1;
                for (let i = 0; i < length; i++) {
                    temp.push({y: this.B.y, x: x + i * factor});
                }
                temp.push({x: this.B.x, y: this.B.y});

                let res: PointLike[] = [];
                for (let i = 0; i < temp.length; i++) {
                    if (JSON.stringify(res).indexOf(JSON.stringify(temp[i])) === -1) {
                        res.push(temp[i]);
                    }
                }
                temp = res;
                shortest = shortest.length === 0 ? temp : (shortest.length > temp.length ? temp : shortest);
            }
        }

        this.result = shortest;
        this.complete();
    }

    private isXXClear(y: number, a: number, b: number) {
        if (this.grid[y][a] !== this.CLEAR || this.grid[y][b] !== this.CLEAR) {
            return false;
        }

        if (a === b) {
            return true;
        }

        if (a > b) {
            const temp = a;
            a = b;
            b = temp;
        }

        if (b - a === 1) {
            return true;
        }

        for (let i = a; i < b; i++) {
            if (this.grid[y][i] > 0) {
                return false;
            }
        }

        return true;
    }

    private isYYClear(x: number, a: number, b: number) {
        if (this.grid[a][x] !== this.CLEAR || this.grid[b][x] !== this.CLEAR) {
            return false;
        }

        if (a === b) {
            return true;
        }

        if (a > b) {
            const temp = a;
            a = b;
            b = temp;
        }

        if (b - a === 1) {
            return true;
        }

        for (let i = a; i < b; i++) {
            if (this.grid[i][x] > 0) {
                return false;
            }
        }
        
        return true;       
    }
}