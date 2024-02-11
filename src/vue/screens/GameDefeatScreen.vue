<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { ref } from 'vue';

const Popup = ref(null);

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.GameEndButton);
}
</script>

<template>
    <div class="GameDefeatScreen">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <div class="Label">{{ Localization.getText('defeated.defeated') }}</div>
                <div class="HalfStartButton">{{ Localization.getText('defeated.again') }}</div>
            </div>
            <button class="StartButton" @click="handleClick">{{ Localization.getText('start.play') }}</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.GameDefeatScreen {
    @include scene-container;
}

.GameDefeatScreen .PopupLevelOne {
    @include popup_level_one;
}

.GameDefeatScreen .PopupLevelTwo {
    @include popup_level_two;
}

.GameDefeatScreen .Label {
    @include label_screen;
    margin-bottom: 10%;
}

.GameDefeatScreen .StartButton {
    @include button_screen;
}

.GameDefeatScreen .StartButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}

.GameDefeatScreen .HalfStartButton {
    @include button_screen;
    align-self: self-start;
    font-size: 2rem;
    margin-bottom: 5%;
}

.GameDefeatScreen .HalfStartButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}
</style>

