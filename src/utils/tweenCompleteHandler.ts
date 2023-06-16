import { Tween } from '@tweenjs/tween.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function tweenCompleteHandler(tween: Tween<any>): Promise<Tween<any>> {
    return new Promise((resolve) => {
        tween.onComplete(() => {
            resolve(tween);
        });
    });
}
