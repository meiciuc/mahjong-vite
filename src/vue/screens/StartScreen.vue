<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { ref } from 'vue';


const Popup = ref(null);

const handleStart = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.StartButton, {});
}
const handleTutorial = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.TutorialButton, {});
}
</script>

<template>
    <div class="StartScreen">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <div class="Label">{{ Localization.getText('start.mahjong') }}</div>
                <div class="Label">{{ Localization.getText('start.kitchen') }}</div>
                <div class="HalfLabel">{{ Localization.getText('start.reachTheHighestLevel') }}</div>
            </div>
            <button class="StartButton" @click="handleStart">{{ Localization.getText('start.play') }}</button>
            <button class="TutorialButton" @click="handleTutorial">{{ Localization.getText('start.tutorial') }}</button>
        </div>

    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.StartScreen {
    @include scene-container;
}

.StartScreen .PopupLevelOne {
    @include popup_level_one;
}

.StartScreen .PopupLevelTwo {
    @include popup_level_two;
}

.StartScreen .Label {
    @include label_screen;
}

.StartScreen .StartButton {
    @include button_screen;
}

.StartScreen .StartButton:hover {
    @include button_screen-hover;
}

.StartScreen .StartButton:active {
    @include button_screen-active;
}

.StartScreen .TutorialButton {
    @include button_screen;
    margin-top: 1rem;
    font-size: 2rem;
}

.StartScreen .TutorialButton:hover {
    @include button_screen-hover;
}

.StartScreen .TutorialButton:active {
    @include button_screen-active;
}

.StartScreen .HalfLabel {
    @include label_base;
    font-size: 2rem;
    font-family: 'Roboto-Light';
    color: $scene_label_text_color;
    margin-top: 0.7rem;
}
</style>
