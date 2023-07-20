import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import { Route } from './utils';

export class Localization {
    public static async setLanguage(lang: string = ''): Promise<void> {
        if(!lang){
            const param = Route.searchParam("lang");
            if(param) lang = param;
        }

        console.log('lang', lang)

        await i18n.use(HttpApi).init({
            lng: lang,
            fallbackLng: 'en',
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
