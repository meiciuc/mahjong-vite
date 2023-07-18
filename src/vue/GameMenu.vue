<script setup lang="ts">
    import { computed } from 'vue';
    import { vueService } from './VueService';
    import { useModel } from '../model/useModel';

    const gameLevel = useModel(["gameLevel"]);
    const helpsCount = useModel(["helpsCount"]);
    const data = useModel(["gameStateTime"]);
    const minutes = computed(() => {return Math.floor(data.value / 60 % 60)});
    const secundes = computed(() => {return Math.floor(data.value % 60)});

    const handleClick = () => {
        vueService.signalHelpButton.dispatch();
    }
</script>

<template>
    <div class="MenuPanel">
        <div>
            <div class="GameLevel">{{ gameLevel }}</div>

            <div class="HelpContainer">
                <div v-if="helpsCount > 0" class="HelpButton" @click="handleClick">HELP</div>
                <div v-else class="HelpButton HelpButtonDisabled">HELP</div>
                <div class="HelpsCount">{{ helpsCount }}</div>
            </div>
        </div>
        

        <div class="Timer">
            {{ `${minutes > 9 ? '' : '0'}${minutes}:${secundes > 9 ? '' : '0'}${secundes}` }}
        </div>
    </div>
    
</template>

<style lang="scss" scoped>

    @import './global.scss';

    div {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .MenuPanel {
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        background: rgba($color: $background_colored, $alpha: 1);
        padding: 10px 20%;
        justify-content: start;
    }

    .GameLevel {
        font-family: 'Inter-SemiBold';
        background: rgba($color: $button_background_colored, $alpha: 1);
        color: white;
        padding-top: calc($button_padding_vertical / 2);
        padding-bottom: calc($button_padding_vertical / 2);
        width: 4em;
        border-radius: $button_border_radius;
        border-color: $button_background_idle;
        border: solid;
        margin-right: 2em;
    }

    .HelpContainer {
        background-color: $background_colored_darken;
        border-radius: $button_border_radius;
        margin-right: 4em;
    }
    .HelpButton {
        font-family: 'Inter-SemiBold';
        color: $button_text_colored;
        background-color: $button_text_idle;
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

    .Timer {
        font-family: 'Inter-SemiBold';
        background: rgba($color: $button_background_colored, $alpha: 1);
        color: white;
        padding-top: calc($button_padding_vertical / 2);
        padding-bottom: calc($button_padding_vertical / 2);
        width: 6em;
        border-radius: $button_border_radius;
        border-color: $button_background_idle;
        border: solid;
    }
</style>
