<script setup lang="ts">
import { vueService, VueServiceSignals } from '../VueService';

</script>

<template>
    <button class="StartButton" @click="vueService.signalDataBus.dispatch(VueServiceSignals.ShareShow)">SHARE</button>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.StartButton {
    @include scene-button;
}

.StartButton:hover {
    @include button_hover;
}
</style>
