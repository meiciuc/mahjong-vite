<script setup lang="ts">
import { useModel } from '../../model/useModel';
import { Localization } from '../../utils/Localization';
import { computed, ref } from 'vue';
import { VueServiceSignals, vueService } from '../VueService';


const Popup = ref(null);
const sound = useModel(["sound"]);

const marginLeft = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().width / 2 - 10}px`;
});

const marginTop = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().height / 2 - 10}px`;
});

const handleClick = () => { }
const handleReset = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.OptionsResetLevels);
}

</script>

<template>
    <div class="Container" @click="handleClick">
        <div ref="Popup" class="Popup" :style="{ marginLeft: marginLeft, marginTop: marginTop }">
            <div>OPTIONS</div>
            <button class="StartButton" @click="handleReset">{{ Localization.getText('options.resetAllLevels') }}</button>
            <div><input type="checkbox" id="checkbox" v-model="sound" /><label for="checkbox">{{
                Localization.getText('options.sound') }}</label></div>
            <div>TUTORIAL</div>
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
    background-color: #777777;
    padding: 20px;
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
