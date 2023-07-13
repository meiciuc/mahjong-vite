<script setup lang="ts">
import { vueService } from './VueService';
    const handleClick = () => {
        vueService.signalStartButton.dispatch();
    }
</script>

<template>
    <div class="StartButton" @click="handleClick">START</div>
</template>

<style lang="scss" scoped>
    .StartButton {
        font-family: 'Inter-SemiBold';
        position: absolute;
        border: solid;
        border-radius: 15px;
        background-color: bisque;
        width: 100px;
        height: 20px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        margin-left: -50px;
        margin-top: -10px;
        left: 50%;
        bottom: 30%;
    }   
</style>
