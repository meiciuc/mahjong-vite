import { adsService } from "./AdsService";

class VisualSettingsService {
    getLanguage() {
        return adsService.getLanguage();
    }

    isMobile() {
        return adsService.isMobile();
    }
}

export const visualSettingsService = new VisualSettingsService();