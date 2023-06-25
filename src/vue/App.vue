<script setup lang="ts">
    import { AppStateEnum } from '../model/GameModel';
    import HelpButton from './HelpButton.vue';
    import StartScreen from './StartScreen.vue';

    let appState = AppStateEnum.NONE;

    // onMounted(() => {
    //     const model = dataService.getRootModel<GameModel>();
    //     model.subscribe(['appState'], appState = () => {return model.data.appState})
    // });
</script>

<template>
    <StartScreen ref="StartScreen" v-if="appState === AppStateEnum.START_SCREEN"></StartScreen>
    <HelpButton ref="HelpButton" v-if="appState === AppStateEnum.GAME_SCREEN"></HelpButton>
</template>

<style lang="scss" scoped>
</style>
