<script setup lang="ts">

import { defineProps, withDefaults } from 'vue';
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';

export interface Props {
    booster: "time" | "question";
    value: number;
    price: number;
}

const props = withDefaults(defineProps<Props>(), {
    booster: "time",
    value: 1,
    price: 100,
});

const handleClick = () => {
    let signal: VueServiceSignals | undefined = undefined;
    if (props.booster === 'time') {
        signal = props.price > 0 ? VueServiceSignals.BoosterTimeSpendScore : VueServiceSignals.BoosterTimeWatchReward;
    }

    if (props.booster === 'question') {
        signal = props.price > 0 ? VueServiceSignals.BoosterHelpSpendScore : VueServiceSignals.BoosterHelpWatchReward;
    }

    if (signal) {
        vueService.signalDataBus.dispatch(signal);
    }
}

</script>
<template>
    <div class="ShopItem">
        <div :class="[props.booster === 'time' ? 'IconTime' : 'IconQuestion']">
            {{ props.booster === 'time' ? '' : Localization.getText('game.help') }}
        </div>
        <div class="Value">{{ `+${props.value}` }}</div>
        <div :class="[props.price > 0 ? 'PriceScore' : 'PriceAds']" @click.stop.prevent="handleClick">
            {{ (props.price > 0 ? `-${props.price}` : '') }}
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '../global.scss';

.ShopItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 24rem;
}

.ShopItem .IconTime {
    width: 4rem;
    height: 4rem;
    background-repeat: no-repeat;
    background-size: 4rem;
    background-position: 40% 60%;
    background-image: url(./assets/svg/iconTime.svg);
}

.ShopItem .IconQuestion {
    @include label_screen;
    width: 4rem;
}


.ShopItem .Value {
    @include label_screen;
    display: flex;
    align-items: flex-start;
    width: 6rem;
}

.ShopItem .PriceScore {
    @include button_screen;
    width: 6rem;
}

.ShopItem .PriceScore:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}

.ShopItem .PriceAds {
    @include button_screen;
    width: 6rem;
    height: 4rem;
    background-repeat: no-repeat;
    background-size: 4rem;
    background-position: 70% 60%;
    background-image: url(./assets/svg/iconVideoAds.svg);
    filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.5));
}

.ShopItem .PriceAds:hover {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5));
}
</style>