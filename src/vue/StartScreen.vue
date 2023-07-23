<script setup lang="ts">
import { Localization } from '../utils/Localization';
import { vueService } from './VueService';
    const handleClick = () => {
        vueService.signalStartButton.dispatch();
    }
</script>

<template>
    <div class="Background"></div>
    <div class="Container">
        <div class="Flex">
            <button class="StartButton" @click="handleClick">{{ Localization.getText('start.play') }}</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>

    @import './global.scss';
    .Container {
        @include scene-grid;
        grid-template: 1fr 1fr 1fr 1fr 1fr / 1fr 1fr 1fr;
    }
    .Flex {
        grid-column-start: 2;
        grid-row-start: 4;
        justify-self: center;
        display: flex;
    }
    .StartButton {
        @include scene-button;
        color: $button_text_colored;
        background-color: $button_text_idle;
        border: solid;
        border-radius: $button_border_radius;
        border-color: $button_text_idle;
    }
    .StartButton:hover {
        background-color: $button_background_colored;
        color: $button_text_idle;
        border-color: $button_text_idle;
        border: solid;
    }
    .Background {
        background-color: $background_colored;
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
    }
</style>
