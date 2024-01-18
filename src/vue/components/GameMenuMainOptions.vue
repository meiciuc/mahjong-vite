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
    <div class="MenuPanel">
        <div v-if="helpsCount > 0" class="OptionsButton" @click="handleClick">
            {{ appState === AppStateEnum.GAME_SCREEN_PAUSE ? '>>' : appState === AppStateEnum.GAME_SCREEN ? '||' :
                '&#x2699;' }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

div {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: 'Inter-SemiBold';
}

.MenuPanel {
    padding: 0.3em 5em;
    display: flex;
    justify-content: right;
}

.OptionsButton {
    @include button;
    min-width: 3em;
    margin-top: 0.5em;
}

.OptionsButton:hover {
    @include button_hover;
}
</style>
