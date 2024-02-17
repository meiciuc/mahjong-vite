<script setup lang="ts">

import { defineProps, computed } from 'vue';

const props = defineProps({
    icon: { type: String }
});

const style = computed(() => {
    return `background-image: url(${props.icon});`;
});
</script>
<template>
    <div class="OptionsMenuButton" :style="style"></div>
</template>
<style lang="scss" scoped>
@import '../global.scss';

.OptionsMenuButton {
    @include button_menu;
    width: 8rem;
    height: 8rem;
    background-repeat: no-repeat;
    background-size: 8rem;
    background-position: 40% 60%;
    filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.5));
}

.OptionsMenuButton:hover {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5));
}
</style>