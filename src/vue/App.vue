<script setup lang="ts">
import { computed } from 'vue';
import { AppStateEnum } from '../model/GameModel';
import { useModel } from '../model/useModel';
import GameMenuMain from './components/GameMenuMain.vue';
import GameMenuMainOptions from './components/GameMenuMainOptions.vue';
import ModalBackground from './components/ModalBackground.vue';
import ModalBackgroundColored from './components/ModalBackgroundColored.vue';
import Options from './popups/Options.vue';
import GameDefeatScreen from './screens/GameDefeatScreen.vue';
import GameDefeatScreenFullscreenAds from './screens/GameDefeatScreenFullscreenAds.vue';
import GamePause from './screens/GamePause.vue';
import GameVictoryScreen from './screens/GameVictoryScreen.vue';
import NoMoreMovesScreen from './screens/NoMoreMovesScreen.vue';
import StartScreen from './screens/StartScreen.vue';
import StartScreenFirst from './screens/StartScreenFirst.vue';

const appState = useModel(["appState"]);

const showGameOptionsButton = computed(() => {
    return appState.value !== AppStateEnum.NONE && appState.value !== AppStateEnum.START_SCREEN_FIRST;
});

const optionsAreVisible = useModel(["optionsAreVisible"]);

const showMainMenu = computed(() => {
    return appState.value !== AppStateEnum.NONE && appState.value !== AppStateEnum.START_SCREEN_FIRST;
});

const showModalBackground = computed(() => {
    return optionsAreVisible.value;
});

const showColoredBackground = computed(() => {
    return appState.value !== AppStateEnum.GAME_SCREEN;
});

// https://html5up.net/uploads/demos/dimension/#
</script>

<template>
    <div id="canvas" class="Canvas"></div>

    <GamePause v-if="appState === AppStateEnum.GAME_SCREEN_PAUSE"></GamePause>

    <Transition>
        <ModalBackgroundColored v-if="showColoredBackground"></ModalBackgroundColored>
    </Transition>


    <Transition>
        <StartScreen v-if="appState === AppStateEnum.START_SCREEN"></StartScreen>
    </Transition>
    <Transition>
        <StartScreenFirst v-if="appState === AppStateEnum.START_SCREEN_FIRST"></StartScreenFirst>
    </Transition>

    <Transition>
        <GameVictoryScreen v-if="appState === AppStateEnum.GAME_VICTORY"></GameVictoryScreen>
    </Transition>

    <Transition>
        <GameDefeatScreen v-if="appState === AppStateEnum.GAME_DEFEAT"></GameDefeatScreen>
    </Transition>
    <Transition>
        <GameDefeatScreenFullscreenAds v-if="appState === AppStateEnum.GAME_DEFEAT_ADS">
        </GameDefeatScreenFullscreenAds>
    </Transition>
    <Transition>
        <NoMoreMovesScreen v-if="appState === AppStateEnum.GAME_NO_MORE_MOVES"></NoMoreMovesScreen>
    </Transition>
    <GameMenuMain v-if="showMainMenu">
    </GameMenuMain>
    <Transition>
        <ModalBackground v-if="showModalBackground"></ModalBackground>
    </Transition>
    <Transition>
        <Options v-if="optionsAreVisible"></Options>
    </Transition>
    <GameMenuMainOptions v-if="showGameOptionsButton" class="GameMenuMainOptions">
    </GameMenuMainOptions>
</template>

<style lang="scss" scoped>
// https://stackoverflow.com/questions/23870696/vertical-navigation-with-rotated-text

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

// menu-left

.Canvas {
    position: fixed;
    left: 0px;
    top: 5em;
    width: 100vw;
    height: calc(100vh - 5em);
}

.GameMenuMainOptions {
    position: fixed;
    top: 1px;
    right: 0.1em;
}
</style>