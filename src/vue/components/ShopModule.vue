<script setup lang="ts">
import { adsService } from '../../services/AdsService';
import { VueServiceSignals, vueService } from '../VueService';


</script>

<template>
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
</template>

<style lang="scss" scoped>
@import '../global.scss';

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
