<script setup lang="ts">
import { computed } from 'vue';
import { useModel } from '../../model/useModel';
import { Localization } from '../../utils/Localization';

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
        <div>
            {{ Localization.getText('game.level') }}<div class="GameLevel">{{ gameLevel }}</div>
            {{ Localization.getText('game.points') }}<div class="GameScore">{{ gameTotalScoreFormated }}</div>
        </div>
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
    background: rgba($color: $background_colored, $alpha: 1);
    padding: 10px 30px;
    display: flex;
    justify-content: left;
}

.GameLevel {
    background: rgba($color: $button_background_colored, $alpha: 1);
    color: white;
    padding: calc($button_padding_vertical / 2) calc($button_padding_horizontal / 4);
    min-width: 4em;
    border-radius: $button_border_radius;
    border-color: $button_background_idle;
    border: solid;
    margin-right: 0.3em;
}

.GameScore {
    background: rgba($color: $button_background_colored, $alpha: 1);
    color: white;
    padding: calc($button_padding_vertical / 2) calc($button_padding_horizontal / 4);
    min-width: 6em;
    border-radius: $button_border_radius;
    border-color: $button_background_idle;
    border: solid;
}

.OptionsContainer {
    background-color: $background_colored_darken;
    border-radius: $button_border_radius;
}

.OptionsButton {
    @include scene-button;
    color: $button_text_colored;
    background-color: $button_text_idle;
    padding: 0px calc($button_padding_horizontal / 4);
    border-radius: $button_border_radius;
    border-color: $button_text_idle;
    border: solid;
    font-size: 1.5em;
}

.OptionsButton:hover {
    background-color: $button_background_colored;
    color: $button_text_idle;
    border-color: $button_text_idle;
}

.OptionsButtonDisabled {
    pointer-events: none;
    cursor: auto;
    opacity: 0.7;
}

.HelpsCount {
    user-select: none;
    color: $button_text_idle;
    padding: calc($button_padding_vertical / 2) calc($button_padding_horizontal / 4);
    width: 3em;
}
</style>
