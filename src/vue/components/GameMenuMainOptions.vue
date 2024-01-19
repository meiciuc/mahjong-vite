<script setup lang="ts">
import { VueServiceSignals, vueService } from '../VueService';
import { useModel } from '../../model/useModel';
import { AppStateEnum } from '../../model/GameModel';
const helpsCount = useModel(["helpsCount"]);
const appState = useModel(["appState"]);

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.OptionsButton);
}
</script>

<template>
    <div v-if="helpsCount > 0" class="OptionsButton" @click="handleClick">
        {{ appState === AppStateEnum.GAME_SCREEN_PAUSE ? '>>' : appState === AppStateEnum.GAME_SCREEN ? '||' :
            '&#x2699;' }}
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.OptionsButton {
    @include button;
    min-width: 3em;
    max-width: 3em;
}

.OptionsButton:hover {
    @include button_hover;
}
</style>
