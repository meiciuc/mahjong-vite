<script setup lang="ts">
    import { computed } from 'vue';
    import { vueService } from './VueService';
    import { useModel } from '../model/useModel';
import { Localization } from '../utils/Localization';

    const gameLevel = useModel(["gameLevel"]);
    const gameScore = useModel(["gameScore"]);
    const helpsCount = useModel(["helpsCount"]);
    const stateTime = useModel(["gameStateTime"]);
    const maxTime = useModel(["gameMaxTime"]);
    const minutes = computed(() => {return Math.floor((maxTime.value - stateTime.value) / 60 % 60)});
    const secundes = computed(() => {return Math.floor((maxTime.value - stateTime.value) % 60)});

    const handleClick = () => {
        vueService.signalHelpButton.dispatch();
    }
</script>

<template>
    <div class="MenuPanel">
        <div>
            <div class="GameLevel">{{ gameLevel }}</div>
            <div class="GameScore">{{ gameScore }}</div>
        </div>
        
        <div class="Timer">
            {{ `${minutes > 9 ? '' : '0'}${minutes}:${secundes > 9 ? '' : '0'}${secundes}` }}
        </div>

        <div class="HelpContainer">
            <div v-if="helpsCount > 0" class="HelpButton" @click="handleClick">{{ Localization.getText('game.help') }}</div>
            <div v-else class="HelpButton HelpButtonDisabled">{{ Localization.getText('game.help') }}</div>
            <div class="HelpsCount">{{ helpsCount }}</div>
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
        font-family: 'Inter-SemiBold';
    }
    .MenuPanel {
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        background: rgba($color: $background_colored, $alpha: 1);
        padding: 10px 0;
        display: flex;
        justify-content: space-around;
    }

    .GameLevel {
        background: rgba($color: $button_background_colored, $alpha: 1);
        color: white;
        padding: calc($button_padding_vertical / 2) calc($button_padding_horizontal / 4);
        min-width: 4em;
        border-radius: $button_border_radius;
        border-color: $button_background_idle;
        border: solid;
        margin-right: 0.3em;
    }

    .GameScore {
        background: rgba($color: $button_background_colored, $alpha: 1);
        color: white;
        padding: calc($button_padding_vertical / 2) calc($button_padding_horizontal / 4);
        min-width: 6em;
        border-radius: $button_border_radius;
        border-color: $button_background_idle;
        border: solid;
    }

    .HelpContainer {
        background-color: $background_colored_darken;
        border-radius: $button_border_radius;
    }
    .HelpButton {
        @include scene-button;
        color: $button_text_colored;
        background-color: $button_text_idle;
        padding: calc($button_padding_vertical / 2) calc($button_padding_horizontal / 4);
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
        color: $button_text_idle;
        padding: calc($button_padding_vertical / 2) calc($button_padding_horizontal / 4);
        width: 3em;
    }

    .Timer {
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
