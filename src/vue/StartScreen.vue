<script setup lang="ts">
import { vueService } from './VueService';
    const handleClick = () => {
        vueService.signalStartButton.dispatch();
    }
</script>

<template>
    <div class="Background"></div>
    <div class="Container">
        <div class="StartButton" @click="handleClick">START</div>
    </div>
    
</template>

<style lang="scss" scoped>

    @import './global.scss';
    .Container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        display: flex;
        justify-content: center;
        align-items: end;
        overflow: hidden;
    }
    .StartButton {
        font-family: 'Inter-SemiBold';
        color: $button_text_colored;
        border-radius: $button_border_radius;
        background-color: $button_text_idle;
        text-align: center;
        cursor: pointer;
        user-select: none;
        padding-top: $button_padding_vertical;
        padding-bottom: $button_padding_vertical;
        padding-left: $button_padding_horizontal;
        padding-right: $button_padding_horizontal;

        margin-bottom: 20%;
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
