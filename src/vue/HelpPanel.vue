<script setup lang="ts">
import { vueService } from './VueService';
    const handleClick = () => {
        console.log('help')
        vueService.signalHelpButton.dispatch();
    }
</script>

<template>
    <div class="HelpPanel">
        <div class="HelpButton" @click="handleClick">HELP</div>
    </div>
    
</template>

<style lang="scss" scoped>
    .HelpPanel {
        position: absolute;
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
</style>
