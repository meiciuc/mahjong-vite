<script setup lang="ts">
import { AppStateEnum } from '../model/GameModel';
import GameMenu from './GameMenu.vue';
import GameMenuMain from './GameMenuMain.vue';
import StartScreen from './StartScreen.vue';
import GameVictoryScreen from './GameVictoryScreen.vue';
import GameDefeatedScreen from './GameDefeatedScreen.vue';
import NoMoreMovesScreen from './NoMoreMovesScreen.vue';
import ModalBackground from './ModalBackground.vue';
import { useModel } from '../model/useModel';
import { computed, ref } from 'vue';
import isMobile from 'is-mobile';

const data = useModel(["appState"]);
const appState = computed(() => { return data.value });

const showModalBackground = computed(() => {
    return data.value !== AppStateEnum.GAME_SCREEN;
});

const isLeftMenu = ref(isMobile() && (window.innerWidth > window.innerHeight));

window.addEventListener('resize', () => {
    isLeftMenu.value = isMobile() && (window.innerWidth > window.innerHeight);
})

// https://html5up.net/uploads/demos/dimension/#
</script>

<template>
    <div id="canvas" :class="[isLeftMenu ? 'l-canvas' : 't-canvas']"></div>
    <GameMenuMain :class="[isLeftMenu ? 'l-menu-main' : 't-menu-main']"></GameMenuMain>
    <GameMenu :class="[isLeftMenu ? 'l-menu' : 't-menu']"></GameMenu>
    <ModalBackground v-show="showModalBackground"></ModalBackground>
    <StartScreen v-if="appState === AppStateEnum.START_SCREEN"></StartScreen>
    <GameVictoryScreen v-if="appState === AppStateEnum.GAME_VICTORY"></GameVictoryScreen>
    <GameDefeatedScreen v-if="appState === AppStateEnum.GAME_DEFEATED"></GameDefeatedScreen>
    <NoMoreMovesScreen v-if="appState === AppStateEnum.GAME_NO_MORE_MOVES"></NoMoreMovesScreen>
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