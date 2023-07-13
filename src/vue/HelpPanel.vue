<script setup lang="ts">
import { vueService } from './VueService';
import { useModel } from '../model/useModel';

const helpsCount = useModel(["helpsCount"]);
    const handleClick = () => {
        vueService.signalHelpButton.dispatch();
    }
</script>

<template>
    <div class="HelpPanel">
        <div class="Container">
            <div v-if="helpsCount > 0" class="HelpButton" @click="handleClick">HELP</div>
            <div v-else class="HelpButton HelpButtonDisabled">HELP</div>
            <div class="HelpsCount">{{ helpsCount }}</div>
        </div>
    </div>
    
</template>

<style lang="scss" scoped>

    @import './global.scss';
    .HelpPanel {
        position: absolute;
        display: flex;
        left: 0px;
        top: 0px;
        right: 0px;
        background: rgba($color: $background_colored, $alpha: 1);
        padding: 10px;
    }

    .Container {
        display: flex;
        align-items: center;
        background-color: $background_colored_darken;
        border-radius: $button_border_radius;
    }
    .HelpButton {
        font-family: 'Inter-SemiBold';
        color: $button_text_colored;
        background-color: $button_text_idle;
        text-align: center;
        cursor: pointer;
        user-select: none;
        padding-top: calc($button_padding_vertical / 2);
        padding-bottom: calc($button_padding_vertical / 2);
        padding-left: calc($button_padding_horizontal / 2);
        padding-right: calc($button_padding_horizontal / 2);
        border-radius: $button_border_radius;
        border-color: $button_text_idle;
        border: solid;
    }

    .HelpButton:hover {
        background-color: $button_background_colored;
        color: $button_text_idle;
        border-color: $button_text_idle;
    }
    .HelpButtonDisabled {
        pointer-events: none;
        cursor: auto;
        opacity: 0.7;
    }
    .HelpsCount {
        user-select: none;
        font-family: 'Inter-SemiBold';
        color: $button_text_idle;
        padding-top: calc($button_padding_vertical / 2);
        padding-bottom: calc($button_padding_vertical / 2);
        padding-left: calc($button_padding_horizontal / 2);
        padding-right: calc($button_padding_horizontal / 2);
    }   
</style>
