<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { ref } from 'vue';

const Popup = ref(null);

</script>

<template>
    <div class="TutorialVictoryScreen">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <div class="Label">{{ Localization.getText('victory.victory') }}</div>
                <div class="Label">{{ Localization.getText('start.tutorialFinished') }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.TutorialVictoryScreen {
    @include scene-container;
}

.TutorialVictoryScreen .PopupLevelOne {
    @include popup_level_one;
}

.TutorialVictoryScreen .PopupLevelTwo {
    @include popup_level_two;
}

.TutorialVictoryScreen .Label {
    @include label_screen;
    margin-bottom: 25%;
}

.TutorialVictoryScreen .StartButton {
    @include button_screen;
}

.TutorialVictoryScreen .StartButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}
</style>

