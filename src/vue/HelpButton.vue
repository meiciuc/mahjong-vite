<script setup lang="ts">
import { vueService } from './VueService';
    const handleClick = () => {
        vueService.signalHelpButton.dispatch();
    }
</script>

<template>
    <div class="HelpButton" @click="handleClick">HELP</div>
</template>

<style lang="scss" scoped>
    .HelpButton {
        position: absolute;
        font-family: 'Inter-SemiBold';
        top: 10px;
        left: 10px;
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
