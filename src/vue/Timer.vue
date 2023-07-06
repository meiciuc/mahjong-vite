<script setup lang="ts">
    import { useModel } from '../model/useModel';
    import { computed } from 'vue';

    const data = useModel(["gameStateTime"]);
    const minutes = computed(() => {return Math.floor(data.value / 60 % 60)});
    const secundes = computed(() => {return Math.floor(data.value % 60)});
</script>

<template>
    <div class="Timer">
        {{ `${minutes > 9 ? '' : '0'}${minutes}:${secundes > 9 ? '' : '0'}${secundes}` }}
    </div>
    
</template>

<style lang="scss" scoped>
    .Timer {
        position: absolute;
        left: 50%;
        top: 5px;
        background: rgba($color: #000000, $alpha: 0.3);
        color: white;
        font-size: 1.5em;
    }
</style>
