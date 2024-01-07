<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { computed, ref } from 'vue';


const Popup = ref(null);

const marginLeft = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().width / 2}px`;
});

const marginTop = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().height / 2}px`;
});

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.PauseButton);
}
</script>

<template>
    <div class="Container" @click="handleClick">
        <div ref="Popup" class="Popup" :style="{ marginLeft: marginLeft, marginTop: marginTop }">
            <div>{{ Localization.getText('game.clickAnyPlace') }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.Container {
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
}

.Popup {
    position: relative;
    width: fit-content;
    block-size: fit-content;
    left: 50%;
    top: 50%;
}

.StartButton {
    @include scene-button;
    color: $button_text_colored;
    background-color: $button_text_idle;
    border: solid;
    border-radius: $button_border_radius;
    border-color: $button_text_idle;
}

.StartButton:hover {
    background-color: $button_background_colored;
    color: $button_text_idle;
    border-color: $button_text_idle;
    border: solid;
}
</style>
