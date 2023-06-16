export class TimeSkipper {
    constructor(private timeout: number) {}

    execute(): Promise<this> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this);
            }, this.timeout);
        });
    }
}
