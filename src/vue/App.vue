<script setup lang="ts">
    import { AppStateEnum } from '../model/GameModel';
    import HelpPanel from './HelpPanel.vue';
    import StartScreen from './StartScreen.vue';
    import GameVictoryScreen from './GameVictoryScreen.vue';
    import NoMoreMovesScreen from './NoMoreMovesScreen.vue';
    import ModalBackground from './ModalBackground.vue';
    import { useModel } from '../model/useModel';
    import { computed } from 'vue';

    const data = useModel(["appState"]);
    const appState = computed(() => {return data.value});

    const showModalBackground = computed(() => {
        return data.value !== AppStateEnum.GAME_SCREEN;
    });

</script>

<template>
    <ModalBackground v-show="showModalBackground"></ModalBackground>
    <StartScreen v-if="appState === AppStateEnum.START_SCREEN"></StartScreen>
    <HelpPanel v-if="appState === AppStateEnum.GAME_SCREEN"></HelpPanel>
    <GameVictoryScreen v-if="appState === AppStateEnum.GAME_VICTORY"></GameVictoryScreen>
    <NoMoreMovesScreen v-if="appState === AppStateEnum.GAME_NO_MORE_MOVES"></NoMoreMovesScreen>
</template>

<style lang="scss" scoped>
</style>