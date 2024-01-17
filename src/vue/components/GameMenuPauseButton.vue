<script setup lang="ts">
import { AppStateEnum } from '../../model/GameModel';
import { useModel } from '../../model/useModel';
import { VueServiceSignals, vueService } from '../VueService';

const pause = useModel(["appState"]);

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.PauseButton);
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
    @include button;
    min-width: 3em;
}

.PauseButton:hover {
    @include button_hover;
}
</style>
