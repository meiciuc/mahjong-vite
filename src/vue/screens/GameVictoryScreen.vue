<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { ref } from 'vue';

const Popup = ref(null);

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.GameEndButton);
}
</script>

<template>
    <div class="Container">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <div class="Label">{{ Localization.getText('victory.victory') }}</div>
            </div>
            <button class="StartButton" @click="handleClick">{{ Localization.getText('start.play') }}</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.Container {
    @include scene-container;
}

.PopupLevelOne {
    @include popup_level_one;
}

.PopupLevelTwo {
    @include popup_level_two;
}

.Label {
    @include label_screen;
    margin-bottom: 25%;
}

.StartButton {
    @include button_screen;
}

.StartButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}
</style>

