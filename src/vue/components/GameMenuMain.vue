<script setup lang="ts">
import { useModel } from '../../model/useModel';
import GameMenuTimer from './GameMenuTimer.vue';
import GameMenuHelp from './GameMenuHelp.vue';
import GameMenuScore from './GameMenuScore.vue';

const gameLevel = useModel(["gameLevel"]);

</script>

<template>
    <div class="MenuPanel">
        <div class="MenuContentItem">
            <div class="GameLevel">{{ gameLevel }}</div>
            <GameMenuScore></GameMenuScore>
        </div>
        <div class="Grow1"></div>
        <div class="MenuContentItem">
            <GameMenuTimer class="GameMenuTimer"></GameMenuTimer>
            <GameMenuHelp></GameMenuHelp>
        </div>
        <div class="OptionsButtonPlace"></div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.Grow1 {
    // flex-grow: 1;
}

.OptionsButtonPlace {
    // flex-grow: 2;
    width: 1.4em
}

.MenuPanel {
    width: 100vw;
    height: $game_menu_height;
    position: fixed;

    background: $background_colored;
    display: flex;
    // justify-content: space-evenly;

    align-items: center;
    text-align: center;
    font-family: 'Inter-SemiBold';

    min-width: 80%;
}

.GameMenuTimer {
    // margin-right: 1em;
}

.MenuContentItem {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter-SemiBold';
}

.GameLevel {
    @include menu_button;
    min-width: 1.5em;
}

.GameScoreCurrent {
    @include scene-text-block;
    min-width: 3em;
}
</style>
