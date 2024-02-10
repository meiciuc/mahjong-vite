<script setup lang="ts">
import { VueServiceSignals, vueService } from '../VueService';
import { useModel } from '../../model/useModel';
import { AppStateEnum } from '../../model/GameModel';
import { computed } from 'vue';
const appState = useModel(["appState"]);

const icon = computed(() => {
    switch (appState.value) {
        case AppStateEnum.GAME_SCREEN_PAUSE:
            return 'Pause';
        case AppStateEnum.GAME_SCREEN:
            return 'Play';
        default:
            return '';
    }
});

</script>

<template>
    <div class="OptionsButton" @click="vueService.signalDataBus.dispatch(VueServiceSignals.OptionsButton)">
        <div :class="[icon]">{{ icon === '' ? '&#9881;' : '' }}</div>
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

.Pause {
    width: 3rem;
    height: 3rem;

    background-image: url(./assets/svg/playFill.svg);
    background-repeat: no-repeat;
    background-size: 60%;
    background-position: 40% 60%;
}

.Play {
    width: 3rem;
    height: 3rem;

    background-image: url(./assets/svg/stopFill.svg);
    background-repeat: no-repeat;
    background-size: 60%;
    background-position: 40% 60%;
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
