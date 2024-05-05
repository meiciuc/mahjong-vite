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
    <div class="GameVictoryScreen">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <div class="Label">{{ Localization.getText('victory.victory') }}</div>
            </div>
            <button class="StartButton" @click="handleClick">{{ Localization.getText('start.play') }}</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.GameVictoryScreen {
    @include scene-container;
}

.GameVictoryScreen .PopupLevelOne {
    @include popup_level_one;
}

.GameVictoryScreen .PopupLevelTwo {
    @include popup_level_two;
}

.GameVictoryScreen .Label {
    @include label_screen;
    margin-bottom: 25%;
}

.GameVictoryScreen .StartButton {
    @include button_screen;
}

.GameVictoryScreen .StartButton:hover {
    @include button_screen-hover;
}

.GameVictoryScreen .StartButton:active {
    @include button_screen-active;
}
</style>

