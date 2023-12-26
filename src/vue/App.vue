<script setup lang="ts">
import { AppStateEnum } from '../model/GameModel';
import GameMenu from './components/GameMenu.vue';
import GameMenuMain from './components/GameMenuMain.vue';
import StartScreen from './screens/StartScreen.vue';
import StartScreenFirst from './screens/StartScreenFirst.vue';
import StartScreenNovice from './screens/StartScreenNovice.vue';
import GamePause from './screens/GamePause.vue';
import GameVictoryScreen from './screens/GameVictoryScreen.vue';
import GameDefeatedScreen from './screens/GameDefeatedScreen.vue';
import NoMoreMovesScreen from './screens/NoMoreMovesScreen.vue';
import ModalBackground from './components/ModalBackground.vue';
import ModalBackgroundColored from './components/ModalBackgroundColored.vue';
import { useModel } from '../model/useModel';
import { computed, ref } from 'vue';
import isMobile from 'is-mobile';

const appState = useModel(["appState"]);

const isLeftMenu = ref(isMobile() && (window.innerWidth > window.innerHeight));
const showGameMenu = computed(() => {
    switch (appState.value) {
        case AppStateEnum.GAME_SCREEN:
        case AppStateEnum.GAME_SCREEN_PAUSE:
        case AppStateEnum.GAME_VICTORY:
            return true;
    }
    return false;
});
const showModalBackground = computed(() => {
    return appState.value !== AppStateEnum.GAME_SCREEN && appState.value !== AppStateEnum.GAME_SCREEN_PAUSE;
});
const showColoredBackground = computed(() => {
    switch (appState.value) {
        case AppStateEnum.START_SCREEN:
        case AppStateEnum.START_SCREEN_FIRST:
        case AppStateEnum.START_SCREEN_NOVICE:
            return true;
    }
    return false;
});

window.addEventListener('resize', () => {
    isLeftMenu.value = isMobile() && (window.innerWidth > window.innerHeight);
})

// https://html5up.net/uploads/demos/dimension/#
</script>

<template>
    <div id="canvas" :class="[isLeftMenu ? 'l-canvas' : 't-canvas']"></div>

    <GamePause v-if="appState === AppStateEnum.GAME_SCREEN_PAUSE"></GamePause>
    <ModalBackground v-show="showModalBackground"></ModalBackground>
    <GameMenu v-show="showGameMenu" :class="[isLeftMenu ? 'l-menu' : 't-menu']"></GameMenu>


    <ModalBackgroundColored v-show="showColoredBackground"></ModalBackgroundColored>

    <StartScreen v-if="appState === AppStateEnum.START_SCREEN"></StartScreen>
    <StartScreenFirst v-if="appState === AppStateEnum.START_SCREEN_FIRST"></StartScreenFirst>
    <StartScreenNovice v-if="appState === AppStateEnum.START_SCREEN_NOVICE"></StartScreenNovice>

    <GameVictoryScreen v-if="appState === AppStateEnum.GAME_VICTORY"></GameVictoryScreen>
    <GameDefeatedScreen v-if="appState === AppStateEnum.GAME_DEFEATED"></GameDefeatedScreen>
    <NoMoreMovesScreen v-if="appState === AppStateEnum.GAME_NO_MORE_MOVES"></NoMoreMovesScreen>

    <GameMenuMain v-if="appState !== AppStateEnum.START_SCREEN_FIRST" :class="[isLeftMenu ? 'l-menu-main' : 't-menu-main']">
    </GameMenuMain>
</template>

<style lang="scss" scoped>
// https://stackoverflow.com/questions/23870696/vertical-navigation-with-rotated-text

// menu-left
.l-menu-main {
    width: 100vh;
    height: 45px;
    position: fixed;
    background: #4c4c4c;
    transform-origin: left top;
    transform: rotate(-90deg) translateX(-100%);
}

.l-menu {
    width: 100vh;
    height: 45px;
    position: fixed;
    background: #4c4c4c;
    transform-origin: left top;
    transform: rotate(-90deg) translateX(-100%);
    left: 45px;
}

.l-canvas {
    position: fixed;
    left: 45px;
    top: 0px;
    width: calc(100vw - 45px);
    height: 100vh;
}

// menu-top
.t-menu-main {
    width: 100vw;
    height: 45px;
    position: fixed;
    background: #4c4c4c;
    transform-origin: left top;
    transform: rotate(0deg) translateX(0%);
}

.t-menu {
    width: 100vw;
    height: 45px;
    position: fixed;
    background: #4c4c4c;
    transform-origin: left top;
    transform: rotate(0deg) translateX(0%);
    top: 45px;
}

.t-canvas {
    position: fixed;
    left: 0px;
    top: 45px;
    width: 100vw;
    height: calc(100vh - 45px);
}
</style>