<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { computed, ref } from 'vue';


const Popup = ref(null);

const marginLeft = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().width / 2}px`;
});

const marginTop = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().height / 2}px`;
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
    font-family: $font-family;
}

.Label {
    display: block;
    font-size: 4em;
    color: $button-text-color;
    white-space: none;
    text-align: center;
}

.HalfLabel {
    font-size: 2em;
    color: $button-text-color;
    white-space: normal;
    text-align: center;
}

.SquareLabel {
    font-size: 1em;
    color: $button-text-color;
    white-space: normal;
    text-align: center;
}

.StartButton {
    @include scene-button;
}

.StartButton:hover {
    @include button_hover;
}

.Spacer {
    height: 1em;
}

.SpacerX {
    height: 4em;
}
</style>
