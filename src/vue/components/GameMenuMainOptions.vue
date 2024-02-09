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
    @include button_menu;
    width: 3rem;
    font-size: 2rem;
    color: $menu_label_text_color;
    border-radius: 50%;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
}

.OptionsButton:hover {
    box-shadow: -1rem 1rem 0.4rem 0.4rem rgba(0, 0, 0, 0.1) inset;
}

.SymbolTransform {
    transform: translateY(-.05rem);
}

.Scaled {
    transform: scale(0.5);
}
</style>
