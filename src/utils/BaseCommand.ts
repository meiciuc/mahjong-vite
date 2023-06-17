export class BaseCommand {
    private resolve?: (value: this | PromiseLike<this>) => void;
    private reject?: (value: this | PromiseLike<this>) => void;

    execute(): Promise<this> {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

            this.doExecute();
        });
    }

    protected async doExecute() {
        this.complete();
    }

    protected complete() {
        if (this.resolve) {
            this.resolve(this);
        }
    }

    protected error() {
        if (this.reject) {
            this.reject(this);
        }
    }
}
