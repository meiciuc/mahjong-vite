<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { ref } from 'vue';
import AdditionButtons from '../components/AdditionButtons.vue';

const Popup = ref(null);

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.GameEndButton);
}
</script>

<template>
    <div class="NoMoreMovesScreen">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <div class="Label">{{ Localization.getText('noMoreMoves.noMoreMoves') }}</div>
                <div class="HalfStartButton">{{ Localization.getText('defeated.again') }}</div>
            </div>
            <button class="StartButton" @click="handleClick">{{ Localization.getText('start.play') }}</button>
            <AdditionButtons></AdditionButtons>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.NoMoreMovesScreen {
    @include scene-container;
}

.NoMoreMovesScreen .PopupLevelOne {
    @include popup_level_one;
}

.NoMoreMovesScreen .PopupLevelTwo {
    @include popup_level_two;
}

.NoMoreMovesScreen .Label {
    @include label_screen;
    margin-bottom: 10%;
}

.NoMoreMovesScreen .StartButton {
    @include button_screen;
}

.NoMoreMovesScreen .StartButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}

.NoMoreMovesScreen .HalfStartButton {
    @include button_screen;
    align-self: self-start;
    font-size: 2rem;
    margin-bottom: 5%;
}

.NoMoreMovesScreen .HalfStartButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}
</style>

