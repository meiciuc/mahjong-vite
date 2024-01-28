<script setup lang="ts">
import { useModel } from '../../model/useModel';
import { VueServiceSignals, vueService } from '../VueService';

const helpsCount = useModel(["helpsCount"]);
const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.HelpButton);
}

</script>

<template>
    <div class="HelpContainer" :class="{ HelpContainerDisabled: helpsCount === 0 }" @click="handleClick">
        <div class="HelpButton" :class="{ HelpButtonDisabled: helpsCount === 0 }">?</div>
        <div class="HelpsCount" :class="{ HelpCountDisabled: helpsCount === 0 }">{{ helpsCount }}</div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.HelpContainer {
    position: relative;
}

.HelpContainer:hover .HelpButton {
    @include button_hover;
    border-radius: 1em;
}

.HelpContainerDisabled {
    pointer-events: none;
    cursor: auto;
}

.HelpContainerDisabled .HelpButton {
    opacity: 0.5;
}

.HelpContainerDisabled .HelpsCount {
    border-radius: .6em;
    color: #868684;
    border-color: #868684;
    background: $color_light;
}

.HelpButton {
    @include menu_button;
    min-width: 1.4em;
    min-height: 1.4em;
    height: 1.4em;
    font-size: 2em;
    border-radius: 0.4em;
}

.HelpsCount {
    border-color: $color_5;
    border-radius: 50%;
    color: $color_5;

    border-width: 3px;
    border-style: solid;
    font-size: 1em;

    position: absolute;
    right: 0px;
    bottom: 0px;
    background: #FF7A59;
    margin-right: -15%;
    margin-bottom: -10%;

    width: 1.5em;
    height: 1.5em;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;

    user-select: none;
    cursor: pointer;
}
</style>
