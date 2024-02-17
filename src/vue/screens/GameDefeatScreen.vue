<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { TimeSkipper } from '../../utils/TimeSkipper';
import { VueServiceSignals, vueService } from '../VueService';
import { ref, onMounted } from 'vue';
import { adsService } from '../../services/AdsService';

export interface Props {
    showFullscreenAds: boolean,
    reasonMessage: string
}

const props = withDefaults(defineProps<Props>(), {
    showFullscreenAds: false,
    reasonMessage: 'defeat.defeat',
});

const Popup = ref(null);
const showButtons = ref(false);

onMounted(async () => {
    if (props.showFullscreenAds) {
        adsService.showSticky(false);
        await new TimeSkipper(1000).execute();
        try {
            await adsService.showFullscreen();
        } catch (error) {
            console.error(`Error: adsService.showFullscreen return ${error}`)
        }
    }
    showButtons.value = true;
});

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.GameEndButton);
}
</script>

<template>
    <div class="GameDefeatScreenFullscreenAds">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <div class="Label">{{ Localization.getText(props.reasonMessage) }}</div>
                <div class="HalfStartButton" :class="{ NotShowButtons: !showButtons }">{{
                    Localization.getText('defeat.repeat') }}</div>
            </div>
            <button class="StartButton" :class="{ NotShowButtons: !showButtons }" @click="handleClick">{{
                Localization.getText('start.play') }}</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.GameDefeatScreenFullscreenAds {
    @include scene-container;
}

.GameDefeatScreenFullscreenAds .PopupLevelOne {
    @include popup_level_one;
}

.GameDefeatScreenFullscreenAds .PopupLevelTwo {
    @include popup_level_two;
}

.GameDefeatScreenFullscreenAds .Label {
    @include label_screen;
    margin-bottom: 10%;
}

.GameDefeatScreenFullscreenAds .StartButton {
    @include button_screen;
}

.GameDefeatScreenFullscreenAds .StartButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}

.GameDefeatScreenFullscreenAds .HalfStartButton {
    @include button_screen;
    font-size: 2rem;
    margin-bottom: 5%;
}

.GameDefeatScreenFullscreenAds .HalfStartButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}

.GameDefeatScreenFullscreenAds .NotShowButtons {
    opacity: 0;
    user-select: none;
}
</style>

