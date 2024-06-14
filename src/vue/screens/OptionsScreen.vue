<script setup lang="ts">
import { useModel } from '../../model/useModel';
import { VueServiceSignals, vueService } from '../VueService';
import OptionsMenuButton from '../components/OptionsMenuButton.vue';
import ShopItem from '../components/ShopItem.vue';
import TutorialAnimated from '../components/TutorialAnimated.vue';


const shopIsVisible = useModel(["shopIsVisible"]);
const shop = useModel(["shop"]);
const tutorialMode = useModel(["tutorialMode"]);

const sound = useModel(["sound"]);

const handleSoundClick = () => {
    (sound.value as unknown as any) = !sound.value;
}

const handleShopClick = () => {
    (shopIsVisible.value as unknown as any) = !shopIsVisible.value;
}


</script>

<template>
    <div class="OptionsScreen" @click="vueService.signalDataBus.dispatch(VueServiceSignals.OptionsButton, {});">
        <div v-if="!shopIsVisible" class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <TutorialAnimated class="Tutorial" :size="'35vh'" :marginLeft="'-17vh'"></TutorialAnimated>
            </div>
            <div class="Buttons">
                <OptionsMenuButton v-if="!tutorialMode"  @click.stop.prevent="handleShopClick" :icon="'./assets/svg/shoppingСartFill.svg'">
                </OptionsMenuButton>
                <OptionsMenuButton @click.stop.prevent="handleSoundClick"
                    :icon="sound ? './assets/svg/soundMax.svg' : './assets/svg/soundMute.svg'">
                </OptionsMenuButton>
            </div>
        </div>
        <div v-else class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo Shop">
                <ShopItem v-for="prop in (shop as unknown as any).proposales" :proposal="prop" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';
@import '../transition.scss';

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

.OptionsScreen .Tutorial {
    height: 35vh;
    margin-bottom: 2vh;
}
</style>
