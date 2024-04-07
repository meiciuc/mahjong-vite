<script setup lang="ts">
import { ref } from 'vue';
import { useModel } from '../../model/useModel';
import { VueServiceSignals, vueService } from '../VueService';
import OptionsMenuButton from '../components/OptionsMenuButton.vue';
import ShopItem from '../components/ShopItem.vue';
import TutorialAnimated from '../components/TutorialAnimated.vue';

export interface Props {
    mode?: "options" | "shop";
}

const props = withDefaults(defineProps<Props>(), {
    mode: "options",
});

const shop = useModel(["shop"]);
const tutorialOnly = useModel(["tutorialOnly"]);

const sound = useModel(["sound"]);
let mode = ref(props.mode);

const handleSoundClick = () => {
    (sound.value as unknown as any) = !sound.value;
}


</script>

<template>
    <div class="OptionsScreen" @click="vueService.signalDataBus.dispatch(VueServiceSignals.OptionsButton);">
        <Transition>
            <div v-if="mode === 'options'" class="PopupLevelOne">
                <div ref="Popup" class="PopupLevelTwo">
                    <TutorialAnimated class="Tutorial" :size="'35vh'" :marginLeft="'-17vh'"></TutorialAnimated>
                </div>
                <div class="Buttons">
                    <OptionsMenuButton v-if="!tutorialOnly"  @click.stop.prevent="mode = 'shop'" :icon="'./assets/svg/shoppingСartFill.svg'">
                    </OptionsMenuButton>
                    <OptionsMenuButton @click.stop.prevent="handleSoundClick"
                        :icon="sound ? './assets/svg/soundMax.svg' : './assets/svg/soundMute.svg'">
                    </OptionsMenuButton>
                </div>
            </div>
        </Transition>
        <Transition>
            <div v-if="mode === 'shop'" class="PopupLevelOne">
                <div ref="Popup" class="PopupLevelTwo Shop">
                    <ShopItem v-for="prop in (shop as unknown as any).proposales" :proposal="prop" />
                </div>
            </div>
        </Transition>
        
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
