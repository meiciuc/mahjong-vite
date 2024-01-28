<script setup lang="ts">
import { VueServiceSignals, vueService } from '../VueService';
import { useModel } from '../../model/useModel';
import { AppStateEnum } from '../../model/GameModel';
import { computed } from 'vue';
const appState = useModel(["appState"]);

const scaled = computed(() => {
    return appState.value === AppStateEnum.GAME_SCREEN_PAUSE ? true : appState.value === AppStateEnum.GAME_SCREEN ? true :
        false;
});

</script>

<template>
    <div class="OptionsButton" @click="vueService.signalDataBus.dispatch(VueServiceSignals.OptionsButton)">
        <div :class="{ Scaled: scaled, SymbolTransform: !scaled }">
            {{ appState === AppStateEnum.GAME_SCREEN_PAUSE ? '>>' : appState === AppStateEnum.GAME_SCREEN ? '||' :
                '&#9881;' }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.OptionsButton {
    @include menu_button;
}

.OptionsButton:hover {
    @include button_hover;
}

.SymbolTransform {
    transform: translateY(-.05rem);
}

.Scaled {
    transform: scale(0.5);
}
</style>
