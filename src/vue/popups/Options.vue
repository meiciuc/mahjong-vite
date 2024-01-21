<script setup lang="ts">
import { useModel } from '../../model/useModel';
import { Localization } from '../../utils/Localization';
import { computed, ref } from 'vue';
import { VueServiceSignals, vueService } from '../VueService';
import { adsService } from '../../services/AdsService';


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
            <div class="Text">Buy time (1 min.)
                <div class="Grow"></div>
                <button class="Item"
                    @click="() => { vueService.signalDataBus.dispatch(VueServiceSignals.BoosterTimeSpendScore) }">-100</button>
                <button class="Item" v-if="adsService.isRewardedAvaliable()"
                    @click="() => { vueService.signalDataBus.dispatch(VueServiceSignals.BoosterTimeWatchReward) }">Video</button>
            </div>
            <div class="Text">Buy help (3 help)
                <div class="Grow"></div>
                <button class="Item"
                    @click="() => { vueService.signalDataBus.dispatch(VueServiceSignals.BoosterHelpSpendScore) }">-100</button>
                <button class="Item" v-if="adsService.isRewardedAvaliable()"
                    @click="() => { vueService.signalDataBus.dispatch(VueServiceSignals.BoosterHelpWatchReward) }">Video</button>
            </div>
            <button class="Item" @click="handleReset">{{ Localization.getText('options.resetAllLevels') }}</button>
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

.Text {
    @include scene-text-block;
    display: flex;
    flex-direction: row;
    min-width: 3em;
    align-items: center;
    padding: 2px;
    font-family: 'Inter-SemiBold';
    min-width: 300px;
}

.Item {
    @include button;
    font-size: 1.5em;
}

.Item:hover {
    @include button_hover;
}

.Grow {
    flex-grow: 1;
}

input {
    cursor: pointer;
}

label {
    cursor: pointer;
}
</style>
