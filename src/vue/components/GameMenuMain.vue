<script setup lang="ts">
import { useModel } from '../../model/useModel';
import GameMenuTimer from './GameMenuTimer.vue';
import GameMenuHelp from './GameMenuHelp.vue';
import GameMenuScore from './GameMenuScore.vue';

const gameLevel = useModel(["gameLevel"]);

</script>

<template>
    <div class="MenuPanel">
        <div class="MenuContent">
            <div class="Grow"></div>
            <div class="MenuContentItem">
                <div class="GameLevel">{{ gameLevel }}</div>
                <GameMenuScore></GameMenuScore>
            </div>
            <div class="MenuContentItem">
                <GameMenuTimer></GameMenuTimer>
                <GameMenuHelp></GameMenuHelp>
            </div>
            <div class="Grow2"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.Grow {
    flex-grow: 1;
}

.Grow {
    flex-grow: 2;
}

.MenuPanel {
    background: $second_color_darken;
    display: flex;
    justify-content: space-evenly;

    align-items: center;
    text-align: center;
    font-family: 'Inter-SemiBold';
}

.MenuContent {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: 'Inter-SemiBold';
}

.MenuContentItem {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: 'Inter-SemiBold';
}

.GameLevel {
    @include scene-text-block;
    min-width: 2em;
    margin-right: 0.3em;
}

.GameScoreCommon {
    @include scene-text-block;
    min-width: 6em;
}

.GameScoreCurrent {
    @include scene-text-block;
    min-width: 3em;
}

.HelpsCount {
    user-select: none;
    color: $button_text_idle;
    // padding: calc($button_padding_vertical / 2) calc($button_padding_horizontal / 4);
    width: 3em;
}
</style>
