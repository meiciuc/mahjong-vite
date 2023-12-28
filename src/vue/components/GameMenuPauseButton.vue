<script setup lang="ts">
import { AppStateEnum } from '../../model/GameModel';
import { useModel } from '../../model/useModel';
import { vueService } from '../VueService';

const pause = useModel(["appState"]);

const handleClick = () => {
    vueService.signalPauseButton.dispatch();
}
</script>

<template>
    <div class="PauseButton" @click="handleClick">
        {{ pause === AppStateEnum.GAME_SCREEN_PAUSE ? '>>' : '||' }}
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.PauseButton {
    @include scene-button;
    color: $button_text_colored;
    background-color: $button_text_idle;
    padding: calc($button_padding_vertical / 2) calc($button_padding_horizontal / 4);
    border-radius: $button_border_radius;
    border-color: $button_text_idle;
    border: solid;
}

.PauseButton:hover {
    background-color: $button_background_colored;
    color: $button_text_idle;
    border-color: $button_text_idle;
}
</style>
