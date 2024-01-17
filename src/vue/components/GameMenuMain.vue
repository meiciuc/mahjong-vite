<script setup lang="ts">
import { computed } from 'vue';
import { useModel } from '../../model/useModel';

const gameLevel = useModel(["gameLevel"]);
const gameTotalScore = useModel(["gameTotalScore"]);

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
            <div class="GameLevel">{{ gameLevel }}</div>
            <div class="GameScore">{{ gameTotalScoreFormated }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.MenuPanel {
    background: $second_color_darken;
    padding: 1em 5em;
    display: flex;
    justify-content: left;
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


.GameLevel {
    @include scene-text-block;
    min-width: 3em;
    margin-right: 0.3em;
}

.GameScore {
    @include scene-text-block;
    min-width: 6em;
}


.HelpsCount {
    user-select: none;
    color: $button_text_idle;
    // padding: calc($button_padding_vertical / 2) calc($button_padding_horizontal / 4);
    width: 3em;
}
</style>
