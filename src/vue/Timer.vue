<script setup lang="ts">
    import { useModel } from '../model/useModel';
    import { computed } from 'vue';

    const data = useModel(["gameStateTime"]);
    const minutes = computed(() => {return Math.floor(data.value / 60 % 60)});
    const secundes = computed(() => {return Math.floor(data.value % 60)});
</script>

<template>
    <div class="Container">
        <div class="Timer">
            {{ `${minutes > 9 ? '' : '0'}${minutes}:${secundes > 9 ? '' : '0'}${secundes}` }}
        </div>
    </div>
</template>

<style lang="scss" scoped>

    @import './global.scss';

    .Container {
        user-select: none;
        pointer-events: none;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: end;
        left: 0px;
        top: 0px;
        right: 0px;
        padding: 10px;
    }
    .Timer {
        font-family: 'Inter-SemiBold';
        background: rgba($color: $button_background_colored, $alpha: 1);
        color: white;
        padding-top: calc($button_padding_vertical / 2);
        padding-bottom: calc($button_padding_vertical / 2);
        width: 6em;
        border-radius: $button_border_radius;
        border-color: $button_background_idle;
        text-align: center;
        border: solid;
    }
</style>
