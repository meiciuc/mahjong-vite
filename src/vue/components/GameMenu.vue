<script setup lang="ts">
import { useModel } from '../../model/useModel';
import GameMenuTimer from './GameMenuTimer.vue';
import GameMenuHelp from './GameMenuHelp.vue';

const gameCurrentScore = useModel(["gameCurrentScore"]);

</script>

<template>
    <div class="MenuPanel">
        <div class="GameScore">{{ gameCurrentScore }}</div>

        <GameMenuTimer></GameMenuTimer>
        <GameMenuHelp></GameMenuHelp>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

div {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: 'Inter-SemiBold';
}

.MenuPanel {
    padding: 0.3em 5em;
    background: $second_color_darken;
    display: flex;
    justify-content: space-around;
}


.GameScore {
    @include scene-text-block;
    min-width: 4em;
}
</style>
