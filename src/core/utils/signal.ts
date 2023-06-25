type SignalCallback<Payload1, Payload2, Payload3, Payload4> = (p1: Payload1, p2: Payload2, p3: Payload3, p4: Payload4) => void;
type Context = unknown;

export class Signal<Payload1 = void, Payload2 = void, Payload3 = void, Payload4 = void> {
    private readonly et = new EventTarget();
    private readonly listners: Map<SignalCallback<Payload1, Payload2, Payload3, Payload4>, [EventListenerObject, Context]> = new Map();

    public on(cb: SignalCallback<Payload1, Payload2, Payload3, Payload4>, context: Context = null) {
        const listner = { handleEvent: (evt: CustomEvent<[Payload1, Payload2, Payload3, Payload4]>) => cb(...evt.detail) };

        this.et.addEventListener('e', listner);
        this.listners.set(cb, [listner, context]);
    }

    public once(cb: SignalCallback<Payload1, Payload2, Payload3, Payload4>, context: Context = null) {
        const listner = {
            handleEvent: (evt: CustomEvent<[Payload1, Payload2, Payload3, Payload4]>) => {
                this.off(cb);
                cb(...evt.detail);
            }
        };

        this.et.addEventListener('e', listner);
        this.listners.set(cb, [listner, context]);
    }

    public off(cb: SignalCallback<Payload1, Payload2, Payload3, Payload4>) {
        const [listner] = this.listners.get(cb);
        if (listner) {
            this.et.removeEventListener('e', listner);
            this.listners.delete(cb);
        }
    }

    public offAll(context: Context = null) {
        if (context === null) {
            for (const [listner] of this.listners.values()) {
                this.et.removeEventListener('e', listner);
            }
            this.listners.clear();
        } else {
            for (const [cb, [listner, ctx]] of this.listners) {
                if (context === ctx) {
                    this.et.removeEventListener('e', listner);
                    this.listners.delete(cb);
                }
            }
        }
    }

    public dispatch(p1: Payload1, p2: Payload2, p3: Payload3, p4: Payload4) {
        this.et.dispatchEvent(new CustomEvent('e', { detail: [p1, p2, p3, p4] }));
    }

    public future(): Promise<[Payload1, Payload2, Payload3, Payload4]> {
        return new Promise<[Payload1, Payload2, Payload3, Payload4]>(
            resolve => this.once((...p) => resolve(p))
        );
    }

    public hasListners(): boolean {
        return this.listners.size !== 0;
    }
}