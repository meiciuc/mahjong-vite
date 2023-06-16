export interface PointLike {
    x: number;
    y: number;
}

export class Point {
    public x: number;
    public y: number;

    public static readonly zero: Point = Object.freeze(new Point(0, 0));
    public static readonly one: Point = Object.freeze(new Point(1, 1));
    public static readonly unitYDir: Point = Object.freeze(new Point(0, 1));
    public static readonly unitYNegDir: Point = Object.freeze(new Point(0, -1));
    public static readonly unitXDir: Point = Object.freeze(new Point(1, 0));
    public static readonly unitXNegDir: Point = Object.freeze(new Point(-1, 0));

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    public set(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }

    public normalise(): this {
        const l = this.magnitude;
        if (l) {
            this.x /= l;
            this.y /= l;
        }

        return this;
    }

    public get magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public get magnitude2(): number {
        return this.x * this.x + this.y * this.y;
    }

    public static clone(p: PointLike): Point {
        return new Point(p.x, p.y);
    }

    public static copy(from: PointLike, to: PointLike) {
        to.x = from.x;
        to.y = from.y;
    }

    public static distance(from: PointLike, to: PointLike): number {
        const x = to.x - from.x;
        const y = to.y - from.y;
        return Math.sqrt(x * x + y * y);
    }

    public static distance2(from: PointLike, to: PointLike): number {
        const x = to.x - from.x;
        const y = to.y - from.y;
        return x * x + y * y;
    }

    public static distanceWithinLimit(from: PointLike, to: PointLike, limit: number): boolean {
        const x = to.x - from.x;
        const y = to.y - from.y;
        return x * x + y * y < limit * limit;
    }

    public static add(a: PointLike, b: PointLike) {
        a.x += b.x;
        a.y += b.y;
    }

    public static addTo(a: PointLike, b: PointLike, res: PointLike) {
        res.x = a.x + b.x;
        res.y = a.y + b.y;
    }

    public static subtract(a: PointLike, b: PointLike) {
        a.x -= b.x;
        a.y -= b.y;
    }

    public static subtractTo(a: PointLike, b: PointLike, res: PointLike) {
        res.x = a.x - b.x;
        res.y = a.y - b.y;
    }

    public static multiply(a: PointLike, factor: number) {
        a.x *= factor;
        a.y *= factor;
    }

    public static multiplyTo(a: PointLike, factor: number, res: PointLike) {
        res.x = a.x * factor;
        res.y = a.y * factor;
    }

    public static divide(a: PointLike, factor: number) {
        a.x /= factor;
        a.y /= factor;
    }

    public static divideTo(a: PointLike, factor: number, res: PointLike) {
        res.x = a.x / factor;
        res.y = a.y / factor;
    }

    public static rotate(p: PointLike, anchor: PointLike, angle: number) {
        Point.subtract(p, anchor);

        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const tx = c * p.x - s * p.y;
        const ty = s * p.x + c * p.y;

        p.x = tx + anchor.x;
        p.y = ty + anchor.y;
    }

    public static rotateTo(p: PointLike, anchor: PointLike, angle: number, res: PointLike) {
        Point.copy(p, res);
        Point.rotate(res, anchor, angle);
    }
}
