<script setup lang="ts">
import { ref } from 'vue';

    const root = ref<HTMLElement | null>(null);

    const handler = () => {
        console.log('handler emitter', root.value);
    }
</script>
<template><button ref="root" @click="handler">TestButton</button></template>
<style lang="scss" scoped>
    button {
        width: 100px;
        height: 33px;
        border: 'solid';
        border-radius: 15px;
        border-color: black;
        text-align: center;
        cursor: pointer;
    }
        
</style>