<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { ref } from 'vue';


const Popup = ref(null);

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.StartButton);
}
</script>

<template>
    <div class="Container">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <div class="Label">{{ Localization.getText('start.mahjong') }}</div>
                <div class="Label">{{ Localization.getText('start.kitchen') }}</div>
                <div class="HalfLabel">{{ Localization.getText('start.reachTheHighestLevel') }}</div>
            </div>
            <button class="StartButton" @click="handleClick">{{ Localization.getText('start.play') }}</button>
        </div>

    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.Container {
    @include scene-container;
}

.PopupLevelOne {
    @include popup_level_one;
}

.PopupLevelTwo {
    @include popup_level_two;
}

.Label {
    @include label_screen;
}

.StartButton {
    @include button_screen;
}

.StartButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}

.HalfLabel {
    @include label_base;
    font-size: 2rem;
    font-family: 'Roboto-Light';
    color: $scene_label_text_color;
    margin-top: 0.7rem;
}
</style>
