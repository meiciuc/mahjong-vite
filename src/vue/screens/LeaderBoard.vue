<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { ref } from 'vue';


const Popup = ref(null);

</script>

<template>
    <div class="LeaderBoard" @click="vueService.signalDataBus.dispatch(VueServiceSignals.LeaderBoardButton);">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <div class="Label">LEADER BORD</div>
            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.LeaderBoard {
    @include scene-container;
}

.LeaderBoard .PopupLevelOne {
    @include popup_level_one;
}

.LeaderBoard .PopupLevelTwo {
    @include popup_level_two;
}

.LeaderBoard .Label {
    @include label_screen;
}

.LeaderBoard .StartButton {
    @include button_screen;
}

.LeaderBoard .TutorialButton {
    @include button_screen;
    margin-top: 1rem;
    font-size: 2rem;
}

.LeaderBoard .StartButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}

.LeaderBoard .TutorialButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}

.LeaderBoard .HalfLabel {
    @include label_base;
    font-size: 2rem;
    font-family: 'Roboto-Light';
    color: $scene_label_text_color;
    margin-top: 0.7rem;
}
</style>
