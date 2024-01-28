<script setup lang="ts">
import { VueServiceSignals, vueService } from '../VueService';
import { useModel } from '../../model/useModel';
import { AppStateEnum } from '../../model/GameModel';
const appState = useModel(["appState"]);

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.OptionsButton);
}
</script>

<template>
    <div class="OptionsButton" @click="handleClick">
        {{ appState === AppStateEnum.GAME_SCREEN_PAUSE ? '>>' : appState === AppStateEnum.GAME_SCREEN ? '||' :
            '&#x2699;' }}
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.OptionsButton {
    @include button;
    width: $game_menu_height;
    height: $game_menu_height;

}

.OptionsButton:hover {
    @include button_hover;
}
</style>
