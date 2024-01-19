<script setup lang="ts">
import { useModel } from '../../model/useModel';
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';

const helpsCount = useModel(["helpsCount"]);
const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.HelpButton);
}

</script>

<template>
    <div class="HelpContainer">
        <div class="HelpsCount">{{ helpsCount }}</div>
        <div v-if="helpsCount > 0" class="HelpButton" @click="handleClick">{{ Localization.getText('game.help') }}</div>
        <div v-else class="HelpButton HelpButtonDisabled">{{ Localization.getText('game.help') }}</div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.HelpContainer {
    background-color: $background_colored_darken;
    border-radius: $button_border_radius;
    display: flex;
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
    width: 2em;
}
</style>
