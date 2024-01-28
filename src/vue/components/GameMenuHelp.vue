<script setup lang="ts">
import { useModel } from '../../model/useModel';
import { VueServiceSignals, vueService } from '../VueService';

const helpsCount = useModel(["helpsCount"]);
const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.HelpButton);
}

</script>

<template>
    <div class="HelpContainer">
        <div class="HelpButton" :class="{ HelpButtonDisabled: helpsCount === 0 }" @click="handleClick">?</div>
        <div class="HelpsCount">{{ helpsCount }}</div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.HelpContainer {
    background-color: $background_colored;
    border-radius: $button_border_radius;
    display: flex;
}

.HelpButton {
    @include menu_button;
    min-width: 1.4em;
    min-height: 1.4em;
    height: 1.4em;
    font-size: 2em;
    border-radius: 0.4em;
}

.HelpButton:hover {
    @include button_hover;
    border-radius: 1em;
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
