<script setup lang="ts">
import { ref, defineProps, withDefaults } from 'vue';
import { useModel } from '../../model/useModel';
import { VueServiceSignals, vueService } from '../VueService';
import OptionsMenuButton from '../components/OptionsMenuButton.vue';
import ShopItem from '../components/ShopItem.vue';

export interface Props {
    mode?: "options" | "shop";
}

const props = withDefaults(defineProps<Props>(), {
    mode: "options",
});

const sound = useModel(["sound"]);
let mode = ref(props.mode);


</script>

<template>
    <div class="OptionsScreen" @click="vueService.signalDataBus.dispatch(VueServiceSignals.OptionsButton);">
        <div v-if="mode === 'options'" class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
            </div>
            <div class="Buttons">
                <OptionsMenuButton @click.stop.prevent="mode = 'shop'" :icon="'./assets/svg/shoppingСartFill.svg'">
                </OptionsMenuButton>
                <OptionsMenuButton style="margin-left: 0.5rem;" :icon="'./assets/svg/addPeople.svg'"></OptionsMenuButton>
                <OptionsMenuButton @click.stop.prevent="sound = !sound"
                    :icon="sound ? './assets/svg/soundMax.svg' : './assets/svg/soundMute.svg'">
                </OptionsMenuButton>
            </div>
        </div>
        <div v-else class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo Shop">
                <ShopItem :booster="'time'" :value=1 :price=100 />
                <ShopItem :booster="'time'" :value=3 :price=-1 />
                <ShopItem :booster="'question'" :value=1 :price=100 />
                <ShopItem :booster="'question'" :value=3 :price=-1 />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.OptionsScreen {
    @include scene-container;
}

.OptionsScreen .PopupLevelOne {
    @include popup_level_one;
}

.OptionsScreen .PopupLevelTwo {
    @include popup_level_two;
}

.OptionsScreen .PopupLevelTwo.Shop {
    @include popup_level_two;

    height: 85vh;
    justify-content: center;
}

.OptionsScreen .Buttons {
    display: flex;
}
</style>
