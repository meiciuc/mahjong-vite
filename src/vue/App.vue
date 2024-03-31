<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { AppStateEnum } from '../model/GameModel';
import { useModel } from '../model/useModel';
import GameMenuMain from './components/GameMenuMain.vue';
import GameMenuMainOptions from './components/GameMenuMainOptions.vue';

import GameDefeatScreen from './screens/GameDefeatScreen.vue';
import GamePause from './screens/GamePause.vue';
import GameVictoryScreen from './screens/GameVictoryScreen.vue';
import StartScreen from './screens/StartScreen.vue';
import OptionsScreen from './screens/OptionsScreen.vue';

const appState = useModel(["appState"]);

const showGameOptionsButton = computed(() => {
    return appState.value !== AppStateEnum.NONE && appState.value !== AppStateEnum.START_SCREEN_FIRST;
});

const optionsAreVisible = useModel(["optionsAreVisible"]);
const shopIsVisible = useModel(["shopIsVisible"]);

const showMainMenu = computed(() => {
    return appState.value !== AppStateEnum.NONE && appState.value !== AppStateEnum.START_SCREEN_FIRST;
});

const showModalBackground = computed(() => {
    return optionsAreVisible.value;
});

const handleResize = () => {
    document.documentElement.style.fontSize = '12px';
}

onMounted(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    handleResize();
})

const showDefeat = computed(() => {
    switch (appState.value) {
        case AppStateEnum.GAME_DEFEAT:
        case AppStateEnum.GAME_DEFEAT_ADS:
        case AppStateEnum.GAME_NO_MORE_MOVES:
        case AppStateEnum.GAME_NO_MORE_MOVES_ADS:
            return true;
        default:
            return false;
    }
});

const showFullscreenAds = computed(() => {
    switch (appState.value) {
        case AppStateEnum.GAME_DEFEAT_ADS:
        case AppStateEnum.GAME_NO_MORE_MOVES_ADS:
            return true;
        default:
            return false;
    }
});

const defeatMessage = computed(() => {
    switch (appState.value) {
        case AppStateEnum.GAME_DEFEAT:
        case AppStateEnum.GAME_DEFEAT_ADS:
            return 'defeat.defeat';
        case AppStateEnum.GAME_NO_MORE_MOVES:
        case AppStateEnum.GAME_NO_MORE_MOVES_ADS:
            return 'defeat.noMoreMoves';
        default:
            return '';
    }
});

// https://html5up.net/uploads/demos/dimension/#
</script>

<template>
    <div class="AppBackground"></div>
    <div id="canvas" class="Canvas"></div>

    <GamePause v-if="appState === AppStateEnum.GAME_SCREEN_PAUSE"></GamePause>

    <Transition>
        <StartScreen
            v-if="!showModalBackground && (appState === AppStateEnum.START_SCREEN || appState === AppStateEnum.START_SCREEN_FIRST)">
        </StartScreen>
    </Transition>

    <Transition>
        <GameVictoryScreen v-if="!showModalBackground && appState === AppStateEnum.GAME_VICTORY"></GameVictoryScreen>
    </Transition>

    <Transition>
        <GameDefeatScreen v-if="!showModalBackground && showDefeat" :show-fullscreen-ads="showFullscreenAds"
            :reason-message="defeatMessage">
        </GameDefeatScreen>
    </Transition>
    <GameMenuMain v-if="showMainMenu" class="GameMenuMain">
    </GameMenuMain>
    <Transition>
        <OptionsScreen v-if="showModalBackground" :mode="shopIsVisible ? 'shop' : 'options'"></OptionsScreen>
    </Transition>
    <GameMenuMainOptions v-if="showGameOptionsButton" class="GameMenuMainOptions">
    </GameMenuMainOptions>
</template>

<style lang="scss" scoped>
// https://stackoverflow.com/questions/23870696/vertical-navigation-with-rotated-text

@import './transition.scss';

.AppBackground {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background-color: white;
}

.Canvas {
    position: fixed;
    left: 0px;
    top: 5rem;
    width: 100vw;
    height: calc(100vh - 5rem);
}

.GameMenuMain {
    margin-top: calc(1rem * 0.5);
    z-index: 1;
}

.GameMenuMainOptions {
    position: fixed;
    margin-top: calc(1rem * 0.7);
    right: 0.1rem;
    z-index: 2;
}
</style>