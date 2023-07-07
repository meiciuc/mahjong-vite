<script setup lang="ts">
import { vueService } from './VueService';
import { useModel } from '../model/useModel';

const helpsCount = useModel(["helpsCount"]);
    const handleClick = () => {
        vueService.signalHelpButton.dispatch();
    }
</script>

<template>
    <div class="HelpPanel">
        <div v-if="helpsCount > 0" class="HelpButton" @click="handleClick">HELP</div>
        <div v-else class="HelpButton HelpButtonDisabled">HELP</div>
        <div class="HelpsCount">{{ helpsCount }}</div>
    </div>
    
</template>

<style lang="scss" scoped>
    .HelpPanel {
        position: absolute;
        display: flex;
        left: 0px;
        top: 0px;
        right: 0px;
        background: rgba($color: #000000, $alpha: 0.3);
        padding: 10px;
    }
    .HelpButton {
        border: solid;
        border-radius: 15px;
        background-color: bisque;
        width: 100px;
        height: 20px;
        text-align: center;
        cursor: pointer;
        user-select: none;
    }
    .HelpButtonDisabled {
        user-select: none;
        cursor: auto;
        opacity: 0.7;
    }
    .HelpsCount {
        background: rgba($color: #000000, $alpha: 0.3);
        margin-left: 1em;
        color: white;
        font-size: 1.5em;
        width: 2em;
        text-align: center;
    }   
</style>
