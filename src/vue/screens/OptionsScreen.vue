<script setup lang="ts">
import { useModel } from '../../model/useModel';
import { VueServiceSignals, vueService } from '../VueService';
import OptionsMenuButton from '../components/OptionsMenuButton.vue';

export interface Props {
    orientation?: "vertical" | "horizontal";
}

const props = withDefaults(defineProps<Props>(), {
    orientation: "horizontal",
});

const sound = useModel(["sound"]);

</script>

<template>
    <div class="OptionsScreen" @click="vueService.signalDataBus.dispatch(VueServiceSignals.OptionsButton);">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
            </div>
            <div :class="[props.orientation === 'horizontal' ? 'ButtonsHorizontal' : 'ButtonsVertical']">
                <OptionsMenuButton @click.stop.prevent="" :icon="'./assets/svg/shoppingСartFill.svg'"></OptionsMenuButton>
                <OptionsMenuButton style="margin-left: 0.5rem;" :icon="'./assets/svg/addPeople.svg'"></OptionsMenuButton>
                <OptionsMenuButton @click.stop.prevent="sound = !sound"
                    :icon="sound ? './assets/svg/soundMax.svg' : './assets/svg/soundMute.svg'">
                </OptionsMenuButton>
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

.OptionsScreen .ButtonsHorizontal {
    display: flex;
}

.OptionsScreen .ButtonsVertical {
    display: flex;
    flex-direction: column;
}
</style>
