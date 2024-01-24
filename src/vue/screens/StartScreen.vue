<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { computed, ref } from 'vue';
import InviteShareModule from '../components/InviteShareModule.vue';


const Popup = ref(null);

const marginLeft = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().width / 2}px`;
});

const marginTop = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().height / 2}px`;
});

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.StartButton);
}
</script>

<template>
    <div class="Container">
        <div ref="Popup" class="Popup" :style="{ marginLeft: marginLeft, marginTop: marginTop }">
            <button class="StartButton" @click="handleClick">{{ Localization.getText('start.play') }}</button>
            <InviteShareModule class="InviteShareModule"></InviteShareModule>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.Container {
    @include scene-container;
}

.Popup {
    @include scene-buttons-block;
}

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

.InviteShareModule {
    margin-top: 1em;
}
</style>
