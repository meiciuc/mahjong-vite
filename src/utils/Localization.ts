import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
// import { Route } from './utils';

export enum Languages {
    ru = 'ru',
    en = 'en',
    fr = 'fr',
    it = 'it',
    de = 'de',
    es = 'es',
    zh = 'zh', // Китайский 
    pt = 'pt', // Португальский
    ko = 'ko', // Корейский
    ja = 'ja', // Японский
    tr = 'tr', // Турекций
    ar = 'ar', // Арабский
    hi = 'hi', // Хинди
    id = 'id', // Индонезийский
}

export class Localization {
    public static async setLanguage(lang: Languages): Promise<void> {
        await i18n.use(HttpApi).init({
            lng: lang,
            fallbackLng: lang,
            debug: true,
            saveMissing: true,
            initImmediate: true,
            backend: {
                loadPath: (`./assets/locales/{{lng}}.json`),
            },
        });
    }

    public static getLanguage() {
        return i18n.language;
    }

    public static getText(key: string) {
        return i18n.t(key);
    };
}
