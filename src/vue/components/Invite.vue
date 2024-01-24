<script setup lang="ts">
import { vueService, VueServiceSignals } from '../VueService';

</script>

<template>
    <button class="StartButton" @click="vueService.signalDataBus.dispatch(VueServiceSignals.InviteShow)">INVITE</button>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.StartButton {
    @include scene-button;
    color: $button_text_colored;
    background-color: $button_text_idle;
    border-color: $button_text_idle;
}

.StartButton:hover {
    background-color: $button_background_colored;
    color: $button_text_idle;
    border-color: $button_text_idle;
}
</style>
