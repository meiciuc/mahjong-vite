<script setup lang="ts">
import { VueServiceSignals, vueService } from '../VueService';
import { useModel } from '../../model/useModel';
import { Localization } from '../../utils/Localization';
import GameMenuTimer from './GameMenuTimer.vue';
import GameMenuPauseButton from './GameMenuPauseButton.vue';

const helpsCount = useModel(["helpsCount"]);
const gameCurrentScore = useModel(["gameCurrentScore"]);

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.HelpButton);
}
</script>

<template>
    <div class="MenuPanel">
        <div class="GameScore">{{ gameCurrentScore }}</div>

        <div>
            <GameMenuTimer></GameMenuTimer>
            <GameMenuPauseButton class="GameMenuPauseButton"></GameMenuPauseButton>
        </div>

        <div class="HelpContainer">
            <div v-if="helpsCount > 0" class="HelpButton" @click="handleClick">{{ Localization.getText('game.help') }}</div>
            <div v-else class="HelpButton HelpButtonDisabled">{{ Localization.getText('game.help') }}</div>
            <div class="HelpsCount">{{ helpsCount }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

div {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: 'Inter-SemiBold';
}

.MenuPanel {
    padding: 0.3em 5em;
    background: $second_color_darken;
    display: flex;
    justify-content: space-around;
}


.GameScore {
    @include scene-text-block;
    min-width: 6em;
}

.HelpContainer {
    background-color: $background_colored_darken;
    border-radius: $button_border_radius;
}

.HelpButton {
    @include button;
    padding: 0em 1em;
}

.HelpButton:hover {
    @include button_hover;
}

.HelpButtonDisabled {
    pointer-events: none;
    cursor: auto;
    opacity: 0.7;
}

.HelpsCount {
    @include scene-text-block;
    width: 3em;
}

.GameMenuPauseButton {
    margin-left: 0.2em;
}
</style>
