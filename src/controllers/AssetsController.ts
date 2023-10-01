import WebFont from "webfontloader";
import { Languages, Localization } from "../utils/Localization";
import { BaseController } from "./BaseController";
import { Signal1 } from "@ash.ts/ash";
import { Assets } from "pixi.js";
import { Config } from "../Config";

export class AssetsController extends BaseController {

    public readonly signal = new Signal1<number>();

    protected async doExecute() {
        await this.loadLanguage();
        await this.loadFonts();
        await this.loadAssest();
        this.complete();
    }

    async loadAssest() {
        return await Assets.load([
            `./assets/${Config.ASSETST_ICONS_VERSION}/icons_atlas.json`,
            `./assets/particle.png`
        ], (value: number) => {
            this.signal.dispatch(value);
        });
    }

    async loadLanguage() {
        return Localization.setLanguage(Languages.en);
    }

    async loadFonts() {
        return new Promise((resolve) => {
            WebFont.load({
                custom: {
                    families: [
                        'Inter-SemiBold',
                    ],
                },
                timeout: 2000,
                active: () => {
                    resolve(true);
                },
                loading: () => {
                    resolve(true);
                },
                inactive: () => {
                    console.error('WebFont: font is inactive');
                    ('inactive')
                    resolve(true);
                },
            });
        });
    }
}