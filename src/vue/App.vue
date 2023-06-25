<script setup lang="ts">
    import { AppStateEnum } from '../model/GameModel';
    import HelpButton from './HelpButton.vue';
    import StartScreen from './StartScreen.vue';
    import GameVictoryScreen from './GameVictoryScreen.vue';
    import { useModel } from '../model/modelHelper';
    import { computed } from 'vue';

    const data = useModel(["appState"]);
    const appState = computed(() => {return data.value});

</script>

<template>
    <StartScreen v-if="appState === AppStateEnum.START_SCREEN"></StartScreen>
    <HelpButton v-if="appState === AppStateEnum.GAME_SCREEN"></HelpButton>
    <GameVictoryScreen v-if="appState === AppStateEnum.GAME_VICTORY"></GameVictoryScreen>
</template>

<style lang="scss" scoped>
</style>
