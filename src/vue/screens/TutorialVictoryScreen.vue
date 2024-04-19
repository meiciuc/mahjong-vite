<script setup lang="ts">
import { ref } from 'vue';
import { Localization } from '../../utils/Localization';

const Popup = ref(null);

</script>

<template>
    <div class="TutorialVictoryScreen">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <img :src="'assets/tutorial/tutorial_short.svg'" type="image/svg+xml" :style="`height: 30vh;`"/>
            </div>
            <div class="Label">{{ Localization.getText('victory.victory') }}</div>
            <div class="Label">{{ Localization.getText('start.tutorialFinished') }}</div>
            
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
}

.TutorialVictoryScreen .Content {
    display: flex;
    flex-direction: column;
}
</style>

