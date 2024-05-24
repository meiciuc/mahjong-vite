<script setup lang="ts">
import { computed } from 'vue';
import { BoosterType } from '../../model/GameModel';
import { Proposal, CurrencyType } from '../../model/ShopModel';
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';

const props = defineProps<{
    proposal: Proposal
}>();

const id = computed(() => {
    return props.proposal.id;
});

const valute = computed(() => {
    return props.proposal.price.valute;
});

const price = computed(() => {
    return props.proposal.price.price;
});

const productType = computed(() => {
    return props.proposal.items[0].product;
});

const productCount = computed(() => {
    return props.proposal.items[0].count;
});

const handleClick = (id: string) => {
    vueService.signalDataBus.dispatch(VueServiceSignals.ProposalPurchased, {id});
}

</script>
<template>
    <div class="ShopItem">
        <div :class="[productType === BoosterType.TIME ? 'IconTime' : 'IconQuestion']"
            :style="productType === BoosterType.TIME ? 'background-image: url(./assets/svg/iconTime.svg);' : ''"
        >
            {{ productType === BoosterType.TIME ? '' : Localization.getText('game.help') }}
        </div>
        <div class="Value">{{ `+${productCount}` }}</div>
        <div :class="[valute === CurrencyType.POINTS ? 'PriceScore' : 'PriceAds']" 
            :style = "valute === CurrencyType.POINTS ? '' : 'background-image: url(./assets/svg/iconVideoAds.svg);'"
            @click.stop.prevent="handleClick(id)"
        >
            {{ (valute === CurrencyType.POINTS ? `-${price}` : '') }}
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
    // background-image: url('./assets/svg/iconTime.svg');
}

.ShopItem .IconQuestion {
    @include label_screen;
    width: 4rem;
}


.ShopItem .Value {
    @include label_screen;
    display: flex;
    align-items: flex-start;
    width: 4rem;
    height: 4rem;

    font-size: 2rem;
    font-family: $button_font_family;
    color: $color_dark;

    border-radius: 50%;
    background: #04FB9C;
    
    align-items: center;
    text-align: center;
    justify-content: center;

    user-select: none;

    box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.5) inset;
    transition: all 100ms cubic-bezier(.25, .57, .68, 1.66);
}

.ShopItem .PriceScore {
    @include button_screen;
    width: 6rem;
}

.ShopItem .PriceScore:hover {
    @include button_screen-hover;
}

.ShopItem .PriceScore:active {
    @include button_screen-active;
}

.ShopItem .PriceAds {
    @include button_screen;
    width: 6rem;
    height: 4rem;
    background-repeat: no-repeat;
    background-size: 4rem;
    background-position: 70% 60%;
    filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.5));
}

.ShopItem .PriceAds:hover {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5));
}

.ShopItem .PriceAds:active {
    filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.5));
}
</style>