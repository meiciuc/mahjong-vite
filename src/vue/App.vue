<script setup lang="ts">
    import { AppStateEnum } from '../model/GameModel';
    import HelpButton from './HelpButton.vue';
    import StartScreen from './StartScreen.vue';
    import GameVictoryScreen from './GameVictoryScreen.vue';
    import NoMoreMovesScreen from './NoMoreMovesScreen.vue';
    import { useModel } from '../model/useModel';
    import { computed } from 'vue';

    const data = useModel(["appState"]);
    const appState = computed(() => {return data.value});

</script>

<template>
    <StartScreen v-if="appState === AppStateEnum.START_SCREEN"></StartScreen>
    <HelpButton v-if="appState === AppStateEnum.GAME_SCREEN"></HelpButton>
    <GameVictoryScreen v-if="appState === AppStateEnum.GAME_VICTORY"></GameVictoryScreen>
    <NoMoreMovesScreen v-if="appState === AppStateEnum.GAME_NO_MORE_MOVES"></NoMoreMovesScreen>
</template>

<style lang="scss" scoped>
</style>