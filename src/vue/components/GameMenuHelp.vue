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
    color: #cdcdcd;
    border-color: #cdcdcd;
    background: $color_light;
}

.HelpContainerDisabled .HelpsCount {
    @include menu_button-disabled;
    border-radius: .6em;
    background: $color_light;
}

.HelpButton {
    @include menu_button;
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
