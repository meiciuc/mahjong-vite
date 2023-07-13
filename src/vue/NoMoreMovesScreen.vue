<script setup lang="ts">
import { vueService } from './VueService';
    const handleClick = () => {
        vueService.signalGameEndButton.dispatch();
    }
</script>

<template>
    <div class="Text">NO MORE MOVES AVALIABLE</div>
    <div class="Button" @click="handleClick">PLAY AGAIN</div>
</template>

<style lang="scss" scoped>
    .Text {
        position: absolute;
        font-family: 'Inter-SemiBold';
        top: 30%;
        left: 20%;
        text-align: center;
        font-size: xx-large;
        color: red;
    }
    .Button {
        position: absolute;
        font-family: 'Inter-SemiBold';
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
