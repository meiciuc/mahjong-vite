<script setup lang="ts">
import { AppStateEnum } from '../model/GameModel';
import GameMenu from './GameMenu.vue';
import StartScreen from './StartScreen.vue';
import GameVictoryScreen from './GameVictoryScreen.vue';
import GameDefeatedScreen from './GameDefeatedScreen.vue';
import NoMoreMovesScreen from './NoMoreMovesScreen.vue';
import ModalBackground from './ModalBackground.vue';
import { useModel } from '../model/useModel';
import { computed } from 'vue';

const data = useModel(["appState"]);
const appState = computed(() => { return data.value });

const showModalBackground = computed(() => {
    return data.value !== AppStateEnum.GAME_SCREEN;
});
// https://html5up.net/uploads/demos/dimension/#
</script>

<template>
    <div id="canvas"></div>
    <GameMenu></GameMenu>
    <ModalBackground v-show="showModalBackground"></ModalBackground>
    <StartScreen v-if="appState === AppStateEnum.START_SCREEN"></StartScreen>
    <GameVictoryScreen v-if="appState === AppStateEnum.GAME_VICTORY"></GameVictoryScreen>
    <GameDefeatedScreen v-if="appState === AppStateEnum.GAME_DEFEATED"></GameDefeatedScreen>
    <NoMoreMovesScreen v-if="appState === AppStateEnum.GAME_NO_MORE_MOVES"></NoMoreMovesScreen>
</template>

<style lang="scss" scoped>
#canvas {
    position: absolute;
    margin-top: 0px;
    margin-left: 0px;

    width: 100%;
    height: 100%;
}
</style>