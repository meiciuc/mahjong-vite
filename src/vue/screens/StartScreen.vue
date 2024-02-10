<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { computed, ref } from 'vue';


const Popup = ref(null);

const marginLeft = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().width / 2}px`;
});

const marginTop = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().height * 0.65}px`;
});

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.StartButton);
}
</script>

<template>
    <div class="Container">
        <div ref="Popup" class="Popup" :style="{ marginLeft: marginLeft, marginTop: marginTop }">
            <div class="Label">{{ Localization.getText('start.mahjong') }}</div>
            <div class="Label">{{ Localization.getText('start.kitchen') }}</div>
            <div class="Spacer"></div>
            <div class="HalfLabel">{{ Localization.getText('start.reachTheHighestLevel') }}</div>
            <div class="SpacerX"></div>
            <button class="StartButton" @click="handleClick">{{ Localization.getText('start.play') }}</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.Container {
    @include scene-container;
}

.Popup {
    @include scene-buttons-block;
}

.Label {
    @include label_base;
    font-size: 4rem;
    font-family: $label_font_family;
    color: $scene_label_text_color;
}

.HalfLabel {
    @include label_base;
    font-size: 2rem;
    font-family: 'Roboto-Light';
    color: $scene_label_text_color;
}

.StartButton {
    @include button_base;
    font-family: $button_font_family;
    color: $scene_button_text_color;
    font-size: 4rem;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
}

.StartButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}

.Spacer {
    height: .7rem;
}

.SpacerX {
    height: 1.2rem;
}
</style>
