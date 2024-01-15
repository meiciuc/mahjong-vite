<script setup lang="ts">
import { AppStateEnum } from '../model/GameModel';
import GameMenu from './components/GameMenu.vue';
import GameMenuMain from './components/GameMenuMain.vue';
import GameMenuMainOptions from './components/GameMenuMainOptions.vue';
import StartScreen from './screens/StartScreen.vue';
import StartScreenFirst from './screens/StartScreenFirst.vue';
import StartScreenNovice from './screens/StartScreenNovice.vue';
import GamePause from './screens/GamePause.vue';
import GameVictoryScreen from './screens/GameVictoryScreen.vue';
import GameDefeatedScreen from './screens/GameDefeatedScreen.vue';
import GameDefeatedScreenFullscreenAds from './screens/GameDefeatedScreenFullscreenAds.vue';
import NoMoreMovesScreen from './screens/NoMoreMovesScreen.vue';
import Options from './popups/Options.vue';
import ModalBackground from './components/ModalBackground.vue';
import ModalBackgroundColored from './components/ModalBackgroundColored.vue';
import { useModel } from '../model/useModel';
import { computed, ref } from 'vue';
import isMobile from 'is-mobile';

const appState = useModel(["appState"]);

const isLeftMenu = ref(isMobile() && (window.innerWidth > window.innerHeight));

const showGameOptionsButton = computed(() => {
    return appState.value !== AppStateEnum.NONE && appState.value !== AppStateEnum.START_SCREEN_FIRST;
});

const optionsAreVisible = useModel(["optionsAreVisible"]);

const showMainMenu = computed(() => {
    return appState.value !== AppStateEnum.NONE && appState.value !== AppStateEnum.START_SCREEN_FIRST;
});

const showGameMenu = computed(() => {
    switch (appState.value) {
        case AppStateEnum.GAME_SCREEN:
        case AppStateEnum.GAME_SCREEN_PAUSE:
        case AppStateEnum.GAME_VICTORY:
        case AppStateEnum.GAME_NO_MORE_MOVES:
        case AppStateEnum.GAME_NO_MORE_MOVES_ADS:
        case AppStateEnum.GAME_NO_MORE_MOVES_CHOOSING:
        case AppStateEnum.GAME_DEFEATED:
        case AppStateEnum.GAME_DEFEATED_ADS:
        case AppStateEnum.GAME_DEFEATED_CHOOSING:
            return true;
        default:
            return false;
    }
});

const showModalBackground = computed(() => {
    return optionsAreVisible.value;
});

const showColoredBackground = computed(() => {
    switch (appState.value) {
        case AppStateEnum.NONE:
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
    <GameMenu v-if="showGameMenu" :class="[isLeftMenu ? 'l-menu' : 't-menu']"></GameMenu>

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
        <StartScreenNovice v-if="appState === AppStateEnum.START_SCREEN_NOVICE"></StartScreenNovice>
    </Transition>

    <Transition>
        <GameVictoryScreen v-if="appState === AppStateEnum.GAME_VICTORY"></GameVictoryScreen>
    </Transition>

    <Transition>
        <GameDefeatedScreen v-if="appState === AppStateEnum.GAME_DEFEATED"></GameDefeatedScreen>
    </Transition>
    <Transition>
        <GameDefeatedScreenFullscreenAds v-if="appState === AppStateEnum.GAME_DEFEATED_ADS">
        </GameDefeatedScreenFullscreenAds>
    </Transition>
    <Transition>
        <NoMoreMovesScreen v-if="appState === AppStateEnum.GAME_NO_MORE_MOVES"></NoMoreMovesScreen>
    </Transition>
    <GameMenuMain v-if="showMainMenu" :class="[isLeftMenu ? 'l-menu-main' : 't-menu-main']">
    </GameMenuMain>
    <Transition>
        <ModalBackground v-if="showModalBackground"></ModalBackground>
    </Transition>
    <Transition>
        <Options v-if="optionsAreVisible"></Options>
    </Transition>
    <GameMenuMainOptions v-if="showGameOptionsButton" :class="[isLeftMenu ? 'l-menu-main' : 't-menu-main']">
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
.l-menu-main {
    width: 100vh;
    height: 45px;
    position: fixed;
    transform-origin: left top;
    transform: rotate(-90deg) translateX(-100%);
}

.l-menu {
    width: 100vh;
    height: 45px;
    position: fixed;
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
    transform-origin: left top;
    transform: rotate(0deg) translateX(0%);
}

.t-menu {
    width: 100vw;
    height: 45px;
    position: fixed;
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