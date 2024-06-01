<script setup lang="ts">
import { VueServiceSignals, vueService } from '../VueService';
import { useModel } from '../../model/useModel';
import { AppStateEnum } from '../../model/GameModel';
const appState = useModel(["appState"]);

</script>

<template>
    <div class="GameMenuMainOptions" @click="vueService.signalDataBus.dispatch(VueServiceSignals.OptionsButton, {})">
        <div v-if="appState === AppStateEnum.GAME_SCREEN" class="SkinSvg"
            style="background-image: url(./assets/svg/stopFill.svg);"></div>
        <div v-else-if="appState === AppStateEnum.GAME_SCREEN_PAUSE" class="SkinSvg"
            style="background-image: url(./assets/svg/playFill.svg);"></div>
        <div v-else>&#9881;</div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.GameMenuMainOptions {
    cursor: pointer;
    width: 3rem;
    height: 3rem;
    font-size: 2rem;
    color: $menu_label_text_color;
    border-radius: 50%;
}

.GameMenuMainOptions .SkinSvg {
    width: 3rem;
    height: 3rem;
    background-position: 50% 50%;
    background-repeat: no-repeat;
}

.GameMenuMainOptions:hover {
    box-shadow: -1rem 1rem 0.4rem 0.4rem rgba(0, 0, 0, 0.1) inset;
}
</style>
