<script setup lang="ts">
import { useModel } from '../../model/useModel';
import { Localization } from '../../utils/Localization';
import { computed, ref } from 'vue';
import { VueServiceSignals, vueService } from '../VueService';
import ShopModule from '../components/ShopModule.vue';

const Popup = ref(null);
const sound = useModel(["sound"]);

const marginLeft = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().width / 2 - 10}px`;
});

const marginTop = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().height / 2 - 10}px`;
});

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.OptionsButton);
}
const handleReset = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.OptionsResetLevels);
}

</script>

<template>
    <div class="Container" @click="handleClick">
        <div ref="Popup" class="Popup" :style="{ marginLeft: marginLeft, marginTop: marginTop }">
            <ShopModule></ShopModule>
            <div class="Spacer"></div>
            <button class="Item" @click="handleReset">{{ Localization.getText('options.resetAllLevels') }}</button>
            <div class="Spacer"></div>
            <div class="Item"><input type="checkbox" id="checkbox" v-model="sound" /><label for="checkbox">{{
                Localization.getText('options.sound') }}</label></div>
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
    @include scene-buttons-block;
    align-items: flex-start;
}

.Item {
    @include button;
    font-size: 1.5em;
}

.Item:hover {
    @include button_hover;
}


input {
    cursor: pointer;
}

label {
    cursor: pointer;
}

.Spacer {
    height: 1em;
}
</style>
