<script setup lang="ts">
import { computed } from 'vue';
import { useModel } from '../../model/useModel';
import GameMenuTimer from './GameMenuTimer.vue';
import GameMenuHelp from './GameMenuHelp.vue';

const gameLevel = useModel(["gameLevel"]);
const gameTotalScore = useModel(["gameTotalScore"]);
const gameCurrentScore = useModel(["gameCurrentScore"]);

const gameTotalScoreFormated = computed(() => {
    const count = gameTotalScore.value;
    if (count > 1000000000) { return `${Math.floor(count / 1000000000)}MM`; }
    if (count > 1000000) { return `${Math.floor(count / 1000000)}M`; }
    return count;
})

</script>

<template>
    <div class="MenuPanel">
        <div class="MenuContent">
            <div class="MenuContentItem">
                <div class="GameLevel">{{ gameLevel }}</div>
                <div class="GameScoreCommon">{{ gameTotalScoreFormated }}</div>
            </div>
            <div class="MenuContentItem">
                <div class="GameScoreCurrent">{{ gameCurrentScore }}</div>
                <GameMenuTimer></GameMenuTimer>
                <GameMenuHelp></GameMenuHelp>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

div {
    margin: 0 5px;
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
