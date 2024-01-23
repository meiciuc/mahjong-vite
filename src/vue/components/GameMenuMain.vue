<script setup lang="ts">
import { useModel } from '../../model/useModel';
import GameMenuTimer from './GameMenuTimer.vue';
import GameMenuHelp from './GameMenuHelp.vue';
import GameMenuScore from './GameMenuScore.vue';

const gameLevel = useModel(["gameLevel"]);

</script>

<template>
    <div class="MenuPanel">
        <div class="Grow1"></div>
        <div class="MenuContentItem">
            <div class="GameLevel">{{ gameLevel }}</div>
            <GameMenuScore></GameMenuScore>
        </div>
        <div class="Grow1"></div>
        <div class="MenuContentItem">
            <GameMenuTimer class="GameMenuTimer"></GameMenuTimer>
            <GameMenuHelp></GameMenuHelp>
        </div>
        <div class="Grow2"></div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.Grow1 {
    flex-grow: 1;
}

.Grow2 {
    flex-grow: 2;
}

.MenuPanel {
    background: $second_color_darken;
    display: flex;
    justify-content: space-evenly;

    align-items: center;
    text-align: center;
    font-family: 'Inter-SemiBold';

    min-width: 80%;
}

.GameMenuTimer {
    margin-right: 15px;
}

.MenuContentItem {
    display: flex;
    justify-content: center;
    align-items: center;
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
